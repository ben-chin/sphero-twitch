var sleep = require('sleep');
var _ = require('underscore');
var Cylon = require('cylon');

var DEFAULT_SPEED = 200

/* ------------------------
 * SPHERO
 * ------------------------ */

var Sphero = (function() {

	var socket;

	/* Constructor */
	function Sphero(socket) {
		this.socket = socket;
	}

	Sphero.prototype.connection = {
		name : 'Sphero',
		adaptor: 'sphero'
	};

	Sphero.prototype.device = {
		name : 'sphero',
		driver : 'sphero'
	};

	Sphero.prototype.work = function(my) {
			my.sphero.stop();

			var name = my.sphero.robot.name;

			this.socket.emit('sphero_connected', {
				name: name
			});

			this.socket
				.on('play-move', function (move) {
					if (move.name == name) {
						after((0.5).seconds(), function () {
							my.sphero.stop();
						});
						my.sphero.roll(DEFAULT_SPEED, move.heading);
					}
				});

			this.socket
				.on('play-stop', function () {
					if (move.name == name) {
						my.sphero.stop();
					}
				});

			this.socket
				.on('start-calibration', function (data) {
					my.sphero.startCalibration();
				});

			this.socket
				.on('stop-calibration', function (data) {
					my.sphero.finishCalibration();
				});

				my.sphero.setRGB('0x0000FF');

	};

	Sphero.prototype.disconnect = function(name) {
		var i;
		for(i = 0; i < Cylon.robots.length; i++) {
			if(Cylon.robots[i].name == name) {
				break;
			}
		}
		Cylon.robots.splice(i, 1);

		console.log('Removed: ' + name);
	};

	return Sphero;
})();

/* Export */
module.exports.Sphero = Sphero;
