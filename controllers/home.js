'use strict';

import nconf from '../load-config';
import SiteSetting from '../models/sitesetting';
import Page from '../models/page';

const environment = nconf.get('NODE_ENV') || process.env.NODE_ENV;

export default (req, res, next) => {
	SiteSetting.findOne({ environment }, (err, settings) => {
		if (err) return next(err);
		
		const url = settings && settings.url;
		
		Page.findOne({ url }, (err, page) => {
			if (err) return next(err);
			
			return res.render('home/index', settings && page ? {
				settings: {
					url: settings.url,
					crawling: settings.crawl,
					emailing: settings.send_email,
					lastUpdated: page.updated_date
				}
			} : null);
		});
	});
};