'use strict';

import express from 'express';
import passport from 'passport';

const router = express.Router();

// Controllers
import * as account from '../controllers/account';
import * as admin from '../controllers/admin';
import home from '../controllers/home';

// Middleware
import isAuthenticated from '../config/passport';

// Routes
router
  // Account routes - login/logout
  .get('/login', account.login)
  .post('/login', account.doLogin)
  .get('/logout', account.logout)
  // Admin routes - admin
  .get('/admin', isAuthenticated, admin.index)
  .post('/admin', isAuthenticated, admin.save)
  // Home route
  .get('/', isAuthenticated, home);

// Export routes
export default router;