angular.module('permintaanBarang.services', [])
.factory('permintaanBarangFactory', ['$resource', function($resource) {
	return $resource('http://104.155.237.40:3000/purchasing/permintaanBarang/:id', {}, {
		'get': {method:'GET', params:{id: '@kode'}},
		'update': {method:'PUT', params:{id: '@kode'}},
		'delete': {method:'DELETE', params:{id: '@kode'}}
	});
}]);
