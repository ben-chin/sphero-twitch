//Load environment variables
var dotenv = require('dotenv');
dotenv._getKeysAndValuesFromEnvFilePath('config.env');
dotenv._setEnvs();
dotenv.load();

var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

var twilio = require('twilio');
var express = require('express');

var app = express();

// Create a route to respond to a call
app.post('/', function(req, res) {
    if (twilio.validateExpressRequest(req, TWILIO_AUTH_TOKEN)) {
        var twiml = new twilio.TwimlResponse();
    }
});

app.listen(process.env.PORT || 8000);