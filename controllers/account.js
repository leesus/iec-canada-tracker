'use strict';

import passport from 'passport';
import isAuthenticated from '../config/passport';
import User from '../models/user';

let login = (req, res, next) => {
  res.render('account/login');
};

let doLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid.').isEmail();
  req.assert('password', 'Password cannot be blank.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(401).render('account/login', {
      success: false,
      message: errors.reduce(function(msg, error) { return `${msg}\n${error.msg}`; }, 'Login failed.'),
      errors: errors
    });
  }

  passport.authenticate('local-login', function(err, user, info) {
    if (err) return console.error(err) && next(err);
    if (!user) return res.status(401).render('account/login', {
      success: false,
      message: 'Login failed.\nEmail and/or password incorrect.'
    });

    req.logIn(user, function(err) {
      if (err) return console.error(err) && next(err);
      res.cookie('user', JSON.stringify(req.user));
      return res.redirect('/');
    });
  })(req, res, next);
};

let logout = (req, res, next) => {
  req.logout();
  return res.redirect('/login');
};

export { login, doLogin, logout };