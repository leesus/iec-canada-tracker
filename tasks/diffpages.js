'use strict';

import nconf from '../load-config';
import SiteSetting from '../models/sitesetting'
import Page from '../models/page';
import sendMail from './email';

const environment = nconf.get('NODE_ENV') || process.env.NODE_ENV; 

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
          SiteSetting.findOne({ environment }, (err, settings) => {
            if (settings && settings.email_addresses.length && settings.email_addresses[0] !== '' && settings.send_email) {
              console.log('Sending email to subscribers');
              return sendMail(done);
            }
            return done();
          });
        });
      } else {
        console.log('No changes')
        return done();
      }
    }
  });
};

export default diffPages;