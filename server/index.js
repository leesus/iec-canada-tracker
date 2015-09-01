'use strict';

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import session from 'express-session';
import validator from 'express-validator';
import Store from 'connect-mongo';

// Routes
import router from './routes';

// Config
import passportConfig from './config/passport';
import config from '../config/secrets';

let secrets = config[process.env.NODE_ENV || 'development'];
let app = express();
let MongoStore = Store({ session: session });

// Connect to mongo
mongoose.connect(secrets.db);
mongoose.connection.on('error', () => console.error('MongoDB Connection Error. Make sure MongoDB is running.'));
mongoose.connection.on('disconnect', () => mongoose.connect(secrets.db));

// middleware
// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade')
app.use(compress());
app.use(validator());
//app.use(favicon(path.join(__dirname, '/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: secrets.sessionSecret,
    store: new MongoStore({
        url: secrets.db,
        autoReconnect: true,
        collection: 'session'
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, './public')));
app.use((req, res, next) => {
    if (req.user) res.cookie('user', JSON.stringify(req.user));
    next();
});

import agenda from '../lib/agenda';
import agendaUI from 'agenda-ui';

app.set('port', process.env.PORT || 3000);

// Agenda UI middleware
app.use('/jobs', agendaUI(agenda, {poll: 30000}));

//TODO: add route to change settings

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
// Stacktraces passed
app.use((err, req, res, next) => {
    res.send(err.status || res.statusCode || 500, {
        success: false,
        message: err.message,
        errors: err.errors || err
    });
});

export default app;
