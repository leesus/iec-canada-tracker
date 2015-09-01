'use strict';

import Page from '../models/page';
import sendMail from './email';

let diffPages = (url, body, done) => {
  Page.findOne({ url: url }, (err, page) => {
    if (err) {
      console.error(err);
      return done();
    }

    if (!page) {
      let newPage = new Page({ url: url, html: body });
      newPage.save((err) => {
        if (err) {
          console.error(err);
          return done();
        }

        console.log('Creating new page')
        return done();
      });
    } else {
      if (page.html !== body) {
        console.log('Page has since changed')
        Page.update({ _id: page._id }, { $set: { html: body }}, (err, page) => {
          if (err) {
            console.error(err);
            return done();
          }

          console.log('Updated saved page')
          sendMail(done);
        });
      } else {
        console.log('No changes')
        return done();
      }
    }
  });
};

export default diffPages;