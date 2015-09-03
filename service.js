'use strict';

import mongoose from 'mongoose';
import Agenda from 'agenda';
import SiteSetting from './models/sitesetting.js';
import Page from './models/page.js';
import config from './config/secrets.js';
import crawl from './tasks/crawl.js';

let agenda = new Agenda();
let secrets = config[process.env.NODE_ENV || 'development'];

// connect to db
agenda.database(secrets.db);

// unlock any jobs on restart
agenda._db.update({lockedAt: {$exists: true } }, { $set : { lockedAt : null } }, (err, numUnlocked) => {
  if (err) console.error(err);
  else console.log(`Unlocked ${numUnlocked} jobs.`);
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