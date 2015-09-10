'use strict';

import nconf from '../load-config';
import service from '../service';
import SiteSetting from '../models/sitesetting';
	 
const environment = nconf.get('NODE_ENV') || process.env.NODE_ENV;

let index = (req, res, next) => {
	SiteSetting.findOne({ environment }, (err, settings) => {
		if (err) return next(err);
		
		if (settings) {
			settings.email_addresses = settings.email_addresses.join();
			return res.render('admin/index', { settings: settings });
		}
		
		return res.render('admin/index');
	});
};

let save = (req, res, next) => {
	SiteSetting.findOne({ environment }, (err, settings) => {
		if (err) return next(err);
		
		settings = settings || new SiteSetting({ environment });
		
		settings.url = req.body.url;
		settings.schedule = req.body.schedule;
		settings.email_addresses = req.body.emailAddresses.split(/\s*,\s*/i);
		settings.send_email = req.body.sendEmail ? true : false;
		settings.crawl = req.body.crawl ? true : false;
		
		settings.save((err, savedSettings) => {
			if (err) return next(err);
			
			if (savedSettings) {
				if (savedSettings.crawl) {
					service.restart(savedSettings);
				} else {
					service.stop();
				}
				return res.render('admin/index', { settings: savedSettings });
			}
		});
	});	
};

export { index, save };