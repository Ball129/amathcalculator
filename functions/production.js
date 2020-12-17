const bodyParser = require('body-parser');
const express = require('express')
const appRouter = require('./apps/appRouter')();
const app = express()

// Set middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "")
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept")
    next()
})

app.use('', appRouter)

module.exports = app