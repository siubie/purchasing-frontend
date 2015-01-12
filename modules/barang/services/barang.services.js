'use strict';

angular.module('barangServices', [])
.factory('barangFactory', ['$resource', function($resource) {
	return $resource('http://104.155.237.40:3000/purchasing/barang/:id', {}, {
		'get': {method:'GET', params:{id: '@kdBarang'}},
		'update': {method:'PUT', params:{id: '@kdBarang'}},
		'delete': {method:'DELETE', params:{id: '@kdBarang'}}
	});
}]);