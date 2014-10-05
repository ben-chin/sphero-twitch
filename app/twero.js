var reply = require('./twilio/reply.js');

var spheroColours = {
    'YBR' : 'Blue',
    'BOR': 'Red',
    'GBR': 'Green'
}
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
        this.spheroInstances[name] = instance;
    }

    Twero.prototype.register = function(number) {
        this.teams[number] = this.currSphero;

        message = "You're part of team " 
        + spheroColours[this.spheros[this.currSphero]] + 
            "! Text [U]p, [D]own, [L]eft, [R]ight to control your team's sphero." + 
            " Good luck :)";

        this.r.sendMessage(number, message);

        this.currSphero = (this.currSphero + 1) % this.spheros.length;
    }

    Twero.prototype.move = function(direction, number) {
        var spheroInstance = this.getSpheroInstance(number);
        var spheroName = spheroColours[spheroInstance.robot.name];
        console.log("Moving sphero " + spheroName + " in direction " + direction);

        after((0.5).seconds(), function () {
            spheroInstance.stop();
        });
        spheroInstance.roll(200, direction); 
    }

    Twero.prototype.getSpheroInstance = function (number) {
        var sphero = this.spheros[this.teams[number]];
        return this.spheroInstances[sphero].sphero;
    }

    return Twero;
})();

// Export 
module.exports.Twero = Twero;
