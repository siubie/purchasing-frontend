'use strict';

angular.module('permintaanBarangServices', [])
.factory('permintaanBarangFactory', ['$resource', function($resource) {
	return $resource('http://104.155.237.40:3000/purchasing/permintaanbarang/:id', {}, {
		'get': {method:'GET', params:{id: '@nomor'}},
		'update': {method:'PUT', params:{id: '@nomor'}},
		'delete': {method:'DELETE', params:{id: '@nomor'}}
	});
}]);
