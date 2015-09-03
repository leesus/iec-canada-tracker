'use strict';

import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let PageSchema = new Schema({
  url: { type: String, required: true, unique: true },
  html: { type: String, required: true },
  created_date: { type: Date, 'default': Date.now },
  updated_date: { type: Date, 'default': Date.now }
});

PageSchema.pre('save', function(next) {
  this.updated_date = Date.now();
  next();
});

export default mongoose.model('Page', PageSchema);