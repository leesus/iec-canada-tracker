'use strict';

import mongoose from 'mongoose';
import Agenda from 'agenda';
import nconf from './load-config';
import SiteSetting from './models/sitesetting.js';
import Page from './models/page.js';
import crawl from './tasks/crawl.js';

let agenda = new Agenda();

const dbConnectionString = nconf.get('DB:CONNECTION_STRING');
const environment = nconf.get('NODE_ENV') || process.env.NODE_ENV;

// connect to db
agenda.database(dbConnectionString);

// unlock any jobs on restart
agenda._db.update({lockedAt: {$exists: true } }, { $set : { lockedAt : null } }, (err, numUnlocked) => {
  if (err) console.error(err);
  else console.log(`Unlocked ${numUnlocked} jobs.`);
});

// if we have settings already, start the service
SiteSetting.findOne({ environment }, (err, settings) => {
  if (err) {
    return console.error(err);
  }
  
  if (settings && settings.url && settings.crawl) {
    return startJob(settings);
  }
});

function startJob(siteSettings) {
  // start crawling
  agenda.define('crawl iec site', (job, done) => {
    crawl(siteSettings.url, done);
  });
  
  agenda.every(siteSettings.schedule, 'crawl iec site');
  
  // start agenda
  agenda.start();
}

function graceful() {
  console.log('Stopping agenda');
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// Add restart method so we can dynamically update
agenda.restart = (settings) => {
  console.log('Stopping agenda');
  agenda.stop(() => { 
    console.log('Purging jobs');
    agenda.purge(() => {
      console.log('Deleting old pages');
      Page.remove({}, (err) => {
        if (err) return console.log(err);        
        console.log('Restarting agenda');
        startJob(settings);
      });
    })
  });
};

export default agenda;