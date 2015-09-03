'use strict';

import SiteSetting from '../models/sitesetting';
import Page from '../models/page';

export default (req, res, next) => {
	SiteSetting.findOne({ environment: process.env.NODE_ENV || 'development' }, (err, settings) => {
		if (err) return next(err);
		
		Page.find((err, pages) => {
			if (err) return next(err);
			
			return res.render('home/index', settings && pages.length ? {
				settings: {
					url: settings.url,
					crawling: settings.crawl,
					emailing: settings.sendEmail,
					lastUpdated: pages[0].updated_date
				}
			} : null);
		});
	});
};