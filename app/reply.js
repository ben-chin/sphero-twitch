//Load environment variables
var dotenv = require('dotenv');
dotenv._getKeysAndValuesFromEnvFilePath('config.env');
dotenv._setEnvs();
dotenv.load();

var http = require('http');
 
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
var TWILIO_NUMBER = process.env.TWILIO_NUMBER;

var client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function sendMessage(number, message) {
        client.sendSms({
        to: number,
        from: TWILIO_NUMBER,
        body:message
    }, function(error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
     
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
        }   
    });
}
