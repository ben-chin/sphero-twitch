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

		Socket.forward('player-registered');
		$scope.$on('socket:player-registered',
			function (event, data) {
				console.log(event);
				console.log(data);
				
				var team = '';

				if(data.sphero == 'GBR') {
					team = 'Green';
				} else if(data.sphero == 'BOR') {
					team = 'Red';
				} else if(data.sphero == 'YBR') {
					team = 'Blue';
				}

				var player = {
					number: data.number,
					sphero: data.sphero,
					team: team
				};
				$scope.players.push(player);
			});

		Socket.forward('add-move');
		$scope.$on('socket:add-move',
			function (event, data) {
				console.log(event);
				console.log(data);
				
				var move = {
					number: data.number,
					direction: data.move
				};
				
				$scope.moves[data.sphero].push(move);
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

		$scope.spheros = ['GBR', 'BOR', 'YBR'];

		$scope.players = [];

		$scope.moves = {
			GBR: [],
			BOR: [],
			YBR: []
		};
	}]);
