const bodyParser = require('body-parser');
const express = require('express')
const appRouter = require('./apps/appRouter')();
const app = express()

// Set middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://amathcalculator.web.app")
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept")
    next()
})

app.use('', appRouter)

module.exports = app