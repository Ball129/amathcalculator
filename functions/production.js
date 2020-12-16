const bodyParser = require('body-parser');
const express = require('express')
const appRouter = require('./apps/appRouter')();
const app = express()

// Set middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('', appRouter)

module.exports = app