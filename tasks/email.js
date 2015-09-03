'use strict';

import nodemailer from 'nodemailer';
import SiteSetting from '../models/sitesetting';
import config from '../config/secrets.js';

let secrets = config[process.env.NODE_ENV || 'development'];

// create reusable transporter object using SMTP transport 
let transporter = nodemailer.createTransport({
    service: secrets.email.provider,
    auth: {
        user: secrets.email.username,
        pass: secrets.email.password
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