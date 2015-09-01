'use strict';

import mongoose from 'mongoose';
import Agenda from 'agenda';
import config from '../config/secrets.js';
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

// start crawling
agenda.define('crawl iec site', (job, done) => {
  crawl(secrets.crawl_url, done);
});

agenda.every(secrets.crawl_schedule, 'crawl iec site');

// start agenda
agenda.start();

function graceful() {
  console.log('Stopping agenda');
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

export default agenda;