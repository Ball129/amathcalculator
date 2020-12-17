const urls = require('../constance/urls.json')
const config = require('../constance/config.json')
const express = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'paparnball@gmail.com',
    pass: config.appPassword
  }
});


module.exports = () => {
    const app = express()

    app.route(urls.root)
        .all((req, res) => {
            res.status(200).send()
        })


    app.route(urls.emailFeedback)
        .post((req, res) => {
            if (!req.body.subject) {
                res.status(400).send('No Subject')
                return
            }

            if (!req.body.details) {
                res.status(400).send('No Details')
                return
            }

            let mailOptions = {
                from: 'paparnball@gmail.com',
                to: ['paparnball@gmail.com'],
                subject: req.body.subject,
                text: req.body.details
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(400).send(error);
                } else {
                    res.status(200).send('Email sent: ' + info.response);
                }
            });
        })
        .all((req, res) => {
            res.status(200).send()
        })

    app.all('*', (req, res) => {
        return res.status(404).send('Not found');
    });

    return app
}