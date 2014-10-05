var reply = require('./twilio/reply.js');
// var map = {}

var Twero = (function() {

    /* Constructor */
    function Twero() {
        this.r = new reply.Reply();
        this.teams = {};
        this.spheros = [];
        this.spheroInstances = {};
        this.currSphero = 0;
    }

    Twero.prototype.addSpheroInstance = function(name, instance) {
        this.spheros.push(name);
        this.spheroInstance[name] = instance;
    }

    Twero.prototype.register = function(number) {
        this.teams[number] = this.currSphero;
        this.currSphero = (this.currSphero + 1) % spheros.length;

        message = "You're part of team " + this.spheros[this.currSphero] + 
            "! Text [U]p, [D]own, [L]eft, [R]ight to control your team's sphero." + 
            " Good luck :)";

        this.r.sendMessage(number, message);
    }

    Twero.prototype.move = function(direction, number) {
        var sphero = this.spheros[this.teams[number]];
        console.log("Moving sphero " + sphero + " in direction " + direction);

        after((0.5).seconds(), function () {
            my.sphero.stop();
        });
        spheroInstances[sphero].sphero.roll(200, direction); 
    }

    return Twero;
})();

// Export 
module.exports.Twero = Twero;
