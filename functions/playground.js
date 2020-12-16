const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express()
const appRouter = require('./apps/appRouter')();

const consoleLogger = (str = 'logged') => (req, res, next) => {
    // console.log()
    return next()
}

// Set middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(`dev`))
app.use(consoleLogger());

// Register apps
app.use('', appRouter)

module.exports = app