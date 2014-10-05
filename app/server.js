/*
 * Imports
 * ========================= */

var Cylon = require('cylon');
var http = require('http');
var url = require('url');
var dotenv = require('dotenv');
var bodyParser = require('body-parser')
var tweroLib = require('./twero.js')

var path = require('path')

var SpheroFactory = require('./sphero.js');
var Router = require('./utils/router.js');

/* ------------------------
 * SERVER
 * ------------------------ */

var express = require('express');
var app = express();
var io = require('socket.io')(http);
var server = require('http').Server(app);

//Load environment variables
dotenv._getKeysAndValuesFromEnvFilePath('twilio/config.env');
dotenv._setEnvs();
dotenv.load();

var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/../'));

var twero = new tweroLib.Twero();
var io = io.listen(server);

var initializeSphero = function(name, color) {
    var portmask = "/dev/tty.Sphero-***-AMP-SPP";
    var sphero = new SpheroFactory.Sphero();

    sphero.name = name;
    sphero.connection.port = portmask.replace('***', name);
    sphero.work = function(my) {
        twero.addSpheroInstance(name, my);
        my.sphero.setRGB(color);

        my.sphero.startCalibration();
        after((5).seconds(), function () {
            my.sphero.finishCalibration();
        });
    }

    Cylon.robot(sphero);
}

initializeSphero('YBR', '0x0000FF'); // blue
initializeSphero('BOR', '0xFF0000'); // red
initializeSphero('GBR', '0x00FF00'); // green
Cylon.start();

server.listen(8000);

var moveSphero = function(number, direction, move) {
    twero.move(direction, number);
    var sphero = twero.getSpheroInstance(number);
    var name = sphero.robot.name;

    io.emit('add-move', {
        sphero: name,
        move: move,
        number: number
    });  
}
// Create a route to respond to a call
app.post('/inbound', function(req, res) {
    console.log("Recieved message: " + req.body.Body);
    try {
        var number = req.body.From;
        switch(req.body.Body.toUpperCase()) {
            case 'REG':
                twero.register(number);
                var sphero = twero.getSpheroInstance(number);
                var name = sphero.robot.name;

                io.emit('player-registered', {
                	number: number,
                	sphero: name 
                });

                break;
            case 'U':
                moveSphero(number, 0, 'Up');
                break;
            case 'D':
                moveSphero(number, 180, 'Down');
                break;
            case 'L':
                moveSphero(number, 260, 'Left');
                break;
            case 'R':
                moveSphero(number, 1000, 'Left');
                break;
            default:
                console.log('Unrecognised message body');
                break;
        }
    } catch (err) {
        console.log("Caught error in inbound handler " + err);
    }
});
