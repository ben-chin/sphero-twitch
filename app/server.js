/* 
 * Imports
 * ========================= */

var Cylon = require('cylon');
var http = require('http');
var url = require('url');
var dotenv = require('dotenv');
var bodyParser = require('body-parser')
var main = require('./main.js')

var SpheroFactory = require('./sphero.js');
var Router = require('./utils/router.js');

/* ------------------------
 * SERVER
 * ------------------------ */

// var app = require('express')();
// var io = require('socket.io')(http);

// var server = http.createServer(function(req, resp) {
// 	console.log('Connection to server');

// 	var path = url.parse(req.url).pathname;
// 	Router.route(path, resp);

// });

var express = require('express');
var http = require('http');
var app = express();

app.use(function(req, res, next){ //This must be set before app.router
   req.server = server;
   next();
});

app.use(app.router); 

app.server.listen(7890);

// server.listen(7890);
var io = io.listen(app.server);
var socket; 
io.on('connection', function(socket) {
	/* New Sphero added */
    socket = socket;
	socket.on('incoming-sphero-connection', function(data) {
		var portmask = "/dev/tty.Sphero-***-AMP-SPP";
		var sphero = new SpheroFactory.Sphero(socket);

		sphero.name = data.name;
		sphero.connection.port = portmask.replace('***', data.name);

		Cylon.robot(sphero).start();
	});

	/* Starting spheros */
	socket.on('activate-spheros', function() {
		Cylon.start();
	});

});


//Load environment variables
dotenv._getKeysAndValuesFromEnvFilePath('twilio/config.env');
dotenv._setEnvs();
dotenv.load();

var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;


// var app = express()
app.use(bodyParser.urlencoded({ extended: false }))

var twero = new main.Twero();

// Create a route to respond to a call
app.post('/inbound', function(req, res) {
	console.log(req.body.Body);
    switch(req.body.Body) {
        case 'REG': 
            number = req.body.From;
            twero.register(number);
            break;
        case 'F':
        case 'B':
        case 'L':
        case 'R':
            socket.emit('play-move', {
                heading: 0,
                name: 'YBR'
            });
            // twero.move(req.body.Body, number);
            break;
        default:
            console.log('swag');
            break;
    }
});

app.listen(process.env.PORT || 8000);
