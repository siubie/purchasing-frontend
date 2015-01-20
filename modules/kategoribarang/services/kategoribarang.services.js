'use strict';

angular.module('kategoriBarangServices', [])
.factory('kategoriBarangFactory', ['$resource', function($resource) {
	return $resource('http://104.155.237.40:3000/purchasing/kategoribarang/:id', {}, {
		'get': {method:'GET', params:{id: '@kode'}},
		'update': {method:'PUT', params:{id: '@kode'}},
		'delete': {method:'DELETE', params:{id: '@kode'}}
	});
}]);
