'use strict';

import express from 'express';
import mongoose from 'mongoose';
import config from '../config/secrets';

let secrets = config[process.env.NODE_ENV || 'development'];
let app = express();

// Connect to mongo
mongoose.connect(secrets.db);
mongoose.connection.on('error', () => console.error('MongoDB Connection Error. Make sure MongoDB is running.'));
mongoose.connection.on('disconnect', () => mongoose.connect(secrets.db));

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
