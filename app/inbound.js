//Load environment variables
var dotenv = require('dotenv');
dotenv._getKeysAndValuesFromEnvFilePath('config.env');
dotenv._setEnvs();
dotenv.load();

var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

var express = require('express');
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// Create a route to respond to a call
app.post('/inbound', function(req, res) {
    switch(req.body.Body) {
        case 'REG': 
            //register number
            //put them in a team 
            //text them back their team
            break;
        case 'F':
            //get numbers team
            //add F to the queue
            break;
        case 'B':
            //get numbers team
            //add B to the queue
            break;
        case 'L':
            //get numbers team
            //add B to the queue
            break;
        case 'R':
            //get numbers team
            //add B to the queue
            break;
        default:
            console.log('swag');
            //sms back and tell them the deal
            break;
    }
});

app.listen(process.env.PORT || 8000);
