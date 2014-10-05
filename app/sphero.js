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
