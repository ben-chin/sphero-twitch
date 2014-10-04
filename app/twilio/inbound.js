var dotenv = require('dotenv');
var express = require('express');
var bodyParser = require('body-parser')
var main = require('./../main.js')

//Load environment variables
dotenv._getKeysAndValuesFromEnvFilePath('config.env');
dotenv._setEnvs();
dotenv.load();

var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))

var twero = new main.Twero();

// Create a route to respond to a call
app.post('/inbound', function(req, res) {
    switch(req.body.Body) {
        case 'REG': 
            number = req.body.From;
            twero.register(number);
            break;
        case 'F':
        case 'B':
        case 'L':
        case 'R':
            twero.move(req.body.Body, number);
            break;
        default:
            console.log('swag');
            break;
    }
});

app.listen(process.env.PORT || 8000);
