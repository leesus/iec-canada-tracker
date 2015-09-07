'use strict';

import service from '../service';
import SiteSetting from '../models/sitesetting';

let index = (req, res, next) => {
	SiteSetting.findOne({ environment: process.env.NODE_ENV || 'development' }, (err, settings) => {
		if (err) return next(err);
		
		if (settings) {
			settings.emailAddresses = settings.emailAddresses.join();
			return res.render('admin/index', { settings: settings });
		}
		
		return res.render('admin/index');
	});
};

let save = (req, res, next) => {
	SiteSetting.findOne({ environment: process.env.NODE_ENV || 'development' }, (err, settings) => {
		if (err) return next(err);
		
		settings = settings || new SiteSetting();
			
		settings.url = req.body.url;
		settings.schedule = req.body.schedule;
		settings.emailAddresses = req.body.emailAddresses.split(/\s*,\s*/i);
		settings.sendEmail = req.body.sendEmail ? true : false;
		settings.crawl = req.body.crawl ? true : false;
		
		settings.save((err, savedSettings) => {
			if (err) return next(err);
			
			console.log('settings', savedSettings);
			
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