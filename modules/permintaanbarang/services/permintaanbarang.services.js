'use strict';

angular.module('permintaanBarangServices', [])
.factory('permintaanBarangFactory', ['$resource', function($resource) {
	return $resource('http://localhost:3000/purchasing/permintaanbarang/:id', {}, {
		'get': {method:'GET', params:{id: '@noSpp'}},
		'update': {method:'PUT', params:{id: '@noSpp'}},
		'delete': {method:'DELETE', params:{id: '@noSpp'}}
	});
}]);