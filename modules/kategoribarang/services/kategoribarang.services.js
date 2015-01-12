'use strict';

angular.module('kategoriBarangServices', [])
.factory('kategoriBarangFactory', ['$resource', function($resource) {
	return $resource('http://localhost:3000/purchasing/kategoribarang/:id', {}, {
		'get': {method:'GET', params:{id: '@kdKategori'}},
		'update': {method:'PUT', params:{id: '@kdKategori'}},
		'delete': {method:'DELETE', params:{id: '@kdKategori'}}
	});
}]);