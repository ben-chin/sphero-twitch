var sControllers = angular.module('sControllers', []);

sControllers.controller('SpheroCtrl', [
	'$scope', 'Socket',
	function ($scope, Socket) {

		Socket.forward('sphero_connected');

		$scope.$on('socket:sphero_connected',
			function (event, data) {
				console.log(event);
				console.log(data);
			});

		$scope.connectToSphero = function(name) {
			Socket.emit('incoming-sphero-connection', { name: name });
		};

		$scope.playStop = function (name) {
			Socket.emit('play-stop');
		};

		$scope.startCalibration = function () {
			Socket.emit('start-calibration');
		};

		$scope.stopCalibration = function () {
			Socket.emit('stop-calibration');
		};

		$scope.playMove = function(heading, name) {
			Socket.emit('play-move', {
				heading: heading,
				name: name
			});
		};

	}]);
