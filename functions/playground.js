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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept")
    next()
})

// Dev middlewares
app.use(morgan(`dev`))
app.use(consoleLogger());

// Register apps
app.use('', appRouter)

module.exports = app