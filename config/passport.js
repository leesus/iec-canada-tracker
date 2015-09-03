'use strict';

import passport from 'passport';
import Local from 'passport-local';
import User from '../models/user';
import config from './secrets';
import mongoose from 'mongoose';

let secrets = config[process.env.NODE_ENV || 'development'];

// Passport strategies
let LocalStrategy = Local.Strategy;

// Session de/serialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

// Local login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  if (email) email = email.toLowerCase();

  process.nextTick(() => {    
    User.findOne({ 'email': email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'No user found.' });

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: 'Email or password incorrect.' });
        return done(null, user, { message: 'Login successful.' });
      });
    });
  });
}));

// Middleware
let isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

export default isAuthenticated;
