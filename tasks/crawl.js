'use strict';

import request from 'request';
import nconf from '../load-config';
import SiteSetting from '../models/sitesetting';
import diffPages from './diffpages';

const environment = nconf.get('NODE_ENV') || process.env.NODE_ENV; 

let crawl = (url, done) => {
  SiteSetting.findOne({ environment }, (err, settings) => {
    if (err) {
      console.error(err);
      return done();
    }
    
    if (settings && settings.crawl) {
      console.log('Crawling %s', url);
      request(url, (err, res, body) => {
        if (err) {
          console.error(err);
          return done();
        }
    
        if (res.statusCode === 200) {
          return diffPages(url, body, done);
        }
      });
    }
      
    return done();
  });
};

export default crawl;