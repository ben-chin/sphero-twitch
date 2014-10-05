/* 
 * Imports
 * ========================= */

var Cylon = require('cylon');
var http = require('http');
var url = require('url');
var dotenv = require('dotenv');
var bodyParser = require('body-parser')
var main = require('./main.js')

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
server.listen(8000);

var twero = new main.Twero();

app.use(bodyParser.urlencoded({ extended: false }))

var initializeSphero = function(name) {
    var portmask = "/dev/tty.Sphero-***-AMP-SPP";
    var sphero = new SpheroFactory.Sphero();

    sphero.name = name;
    sphero.connection.port = portmask.replace('***', name);
    sphero.work = function(my) {
        twero.addSpheroInstance(name, my);
    }

    Cylon.robot(sphero);   
}

initializeSphero('YBR');    
Cylon.start();

// app.get('/', function (req, res) {
//   res.sendFile(path.resolve(__dirname + '/../index.html'));
// });

app.use(express.static(__dirname + '/../'));

var io = io.listen(server);
io.on('connection', function(socket) {
	/* New Sphero added */
	// socket.on('incoming-sphero-connection', function(data) {
	// 	var portmask = "/dev/tty.Sphero-***-AMP-SPP";
	// 	var sphero = new SpheroFactory.Sphero(socket);

	// 	sphero.name = data.name;
	// 	sphero.connection.port = portmask.replace('***', data.name);

	// 	Cylon.robot(sphero).start();
	// });

	/* Starting spheros */
	socket.on('activate-spheros', function() {
		Cylon.start();
	});
});

// Create a route to respond to a call
app.post('/inbound', function(req, res) {
    console.log(req.body.Body);
    try {
        switch(req.body.Body) {
            case 'REG': 
                number = req.body.From;
                twero.register(number);
                var sphero = twero.getSpheroInstance(number);
                var name = sphero.robot.name;

                io.emit('player-registered', {
                	number: number,
                	sphero: name 
                });

                break;
            case 'U':
                twero.move(0, number);
                var sphero = twero.getSpheroInstance(number);
                var name = sphero.robot.name;
                
                io.emit('add-move', {
                	sphero: name,
                	move: 'Up',
                	number: number
                });

                break;
            case 'D':
                twero.move(180, number);

                var sphero = twero.getSpheroInstance(number);
                var name = sphero.robot.name;
                
                io.emit('add-move', {
                	sphero: name,
                	move: 'Down',
                	number: number
                });

                break;
            case 'L':
                twero.move(260, number);

                var sphero = twero.getSpheroInstance(number);
                var name = sphero.robot.name;
                
                io.emit('add-move', {
                	sphero: name,
                	move: 'Left',
                	number: number
                });

                break;
            case 'R':
                twero.move(100, number);

                var sphero = twero.getSpheroInstance(number);
                var name = sphero.robot.name;
                
                io.emit('add-move', {
                	sphero: name,
                	move: 'Right',
                	number: number
                });

                break;
            default:
                console.log('swag');
                break;
        }
    } catch (err) {
        console.log("This broke");
    }
});