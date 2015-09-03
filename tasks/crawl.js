'use strict';

import request from 'request';
import SiteSetting from '../models/sitesetting';
import diffPages from './diffpages';

let crawl = (url, done) => {
  SiteSetting.find((err, settings) => {
    if (err) {
      console.error(err);
      return done();
    }
    
    if (settings.length && settings[0].crawl) {
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