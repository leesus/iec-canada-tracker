'use strict';

import request from 'request';
import diffPages from './diffpages';

let crawl = (url, done) => {
  request(url, (err, res, body) => {
    if (err) {
      console.error(err);
      done();
    }

    if (res.statusCode === 200) {
      diffPages(url, body, done);
    }
  });
};

export default crawl;