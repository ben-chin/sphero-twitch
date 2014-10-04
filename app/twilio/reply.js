//Load environment variables
var dotenv = require('dotenv');
dotenv._getKeysAndValuesFromEnvFilePath('config.env');
dotenv._setEnvs();
dotenv.load();

var Reply = (function() {

    /* Constructor */
    function Reply() {
        this.twilioNumber = process.env.TWILIO_NUMBER;
        this.client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    Reply.prototype.sendMessage = function(number, message) {
            this.client.sendSms({
            to: number,
            from: this.twilioNumber,
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

    return Reply;
})();

// Export 
module.exports.Reply = Reply;
