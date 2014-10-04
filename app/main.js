var reply = require('./twilio/reply.js');
// var map = {}

var Twero = (function() {

    /* Constructor */
    function Twero() {
        this.r = new reply.Reply();
        this.teams = {};
        this.spheros = ['R', 'G', 'B'];
        this.currSphero = 0;
    }

    Twero.prototype.register = function(number) {
        this.teams[number] = this.currSphero;
        this.currSphero = (this.currSphero + 1) % 3;

        message = "You're part of team " + this.spheros[this.currSphero] + 
            "! Text [U]p, [D]own, [L]eft, [R]ight to control your team's sphero." + 
            " Good luck :)";

        this.r.sendMessage(number, message);
    }

    Twero.prototype.move = function(direction, number) {
        sphero = this.spheros[this.teams[number]];
        console.log("Moving sphero " + sphero + " in direction " + direction);
        //TODO Integrate with sphero side and move correct sphero in 'direction'       
    }

    return Twero;
})();

// Export 
module.exports.Twero = Twero;
