'use strict';

import express from 'express';
import passport from 'passport';
import * as passportConfig from '../config/passport';

const router = express.Router();

// Controllers
import * as auth from '../controllers/auth';

// Middleware
let isAuthenticated = passportConfig.isAuthenticated;

// Routes
router
  // Account routes - sign in/sign up/sign out
  .post('/auth/login', auth.login)
  .post('/auth/signup', auth.signup)
  .get('/auth/logout', auth.logout);

// Export routes
export default router;