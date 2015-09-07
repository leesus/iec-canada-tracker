'use strict';

import nodemailer from 'nodemailer';
import nconf from 'nconf';
import SiteSetting from '../models/sitesetting';

nconf.argv()
     .env({ separator: '__' })
     .file('../config/settings.json');

const emailProvider = nconf.get('EMAIL:PROVIDER');
const emailUsername = nconf.get('EMAIL:USERNAME');
const emailPassword = nconf.get('EMAIL:PASSWORD');

// create reusable transporter object using SMTP transport 
let transporter = nodemailer.createTransport({
    service: emailProvider,
    auth: {
        user: emailUsername,
        pass: emailPassword
    },
    debug: true
});

let sendMail = (done) => {
  // Check settings
  SiteSetting.find((err, settings) => {
    if (err) {
      console.error(err);
      return done();
    }
    
    if (!settings.length) return done();
    
    let emailAddresses = settings[0].emailAddresses.join(', ');
    
    if (!emailAddresses) return done();
    
    // setup e-mail data with unicode symbols
    let mailOptions = {
        from: 'IEC Canada Tracker ✔ <ieccanadatracker@gmail.com>', // sender address 
        to: emailAddresses, // list of receivers 
        subject: 'The IEC Canada website has been updated!', // Subject line 
        html: '<h1>The IEC Canada website has been updated!</h1><p>Don\'t get your hopes up, it might not mean that rounds are announced, although, it might...</p><p><a href="' + secrets.crawl_url + '" title="Visit the IEC Canada website">Click here to visit the site and see what was updated</a></p>' // html body 
    };
    
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return done();
        }
  
        console.log('Message sent: ' + info.response);
        return done();
    });
  });
};

export default sendMail;