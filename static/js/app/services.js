var sServices = angular.module('sServices', []);

sServices.factory('Socket', [
	'socketFactory',
	function (socketFactory) {
	    return socketFactory();
	}]);