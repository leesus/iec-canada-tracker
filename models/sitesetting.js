'use strict';

import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let SiteSettingSchema = new Schema({
  environment: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  schedule: { type: String, required: true },
  crawl: { type: Boolean },
  sendEmail: { type: Boolean },
  emailAddresses: [{ type: String }],
  created_date: { type: Date, 'default': Date.now },
  updated_date: { type: Date, 'default': Date.now }
});

SiteSettingSchema.pre('save', function(next) {
  this.updated_date = Date.now();
  next();
});

export default mongoose.model('SiteSetting', SiteSettingSchema);