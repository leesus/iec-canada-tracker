'use strict';

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import path from 'path';
import exphbs from 'express-handlebars';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import session from 'express-session';
import validator from 'express-validator';
import Store from 'connect-mongo';
import passport from 'passport';
import nconf from 'nconf';

// Routes
import router from './routes';

// Config
import passportConfig from './config/passport';

nconf.argv()
     .env({ separator: '__' })
     .file('./config/settings.json');
     
const sessionSecret = nconf.get('SESSION_SECRET');
const dbConnectionString = nconf.get('DB:CONNECTION_STRING');

let app = express();
let MongoStore = Store({ session: session });

// Connect to mongo
mongoose.connect(dbConnectionString);
mongoose.connection.on('error', () => console.error('MongoDB Connection Error. Make sure MongoDB is running.'));
mongoose.connection.on('disconnect', () => mongoose.connect(dbConnectionString));

// Setup handlebars
let hbs = new exphbs.create({
    layoutsDir: path.resolve(__dirname, 'views/shared'),
    partialsDir: path.resolve(__dirname, 'views/shared'),
    defaultLayout: 'layout',
    helpers: {
        checkedIf: function(condition) {
            return (condition) ? 'checked' : '';
        },
        formatDate: function(date) {
            return moment(date).fromNow();
        }
    }
});

// middleware
// view engine setup
app.set('port', nconf.get('port') || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')
app.use(compress());
app.use(validator());
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: sessionSecret,
    store: new MongoStore({
        url: dbConnectionString,
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
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
        res.locals.user = req.user;
    }
    next();
});

import agenda from './service';
import agendaUI from 'agenda-ui';

app.set('port', process.env.PORT || 3000);

// Agenda UI middleware
app.get('/jobs', agendaUI(agenda, {poll: 30000}));

// Routes
app.use(router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
// Stacktraces passed
app.use((err, req, res, next) => {
    res.status(err.status || res.statusCode || 500).send({
        success: false,
        message: err.message,
        errors: err.errors || err
    });
});

export default app;
