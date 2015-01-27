angular.module('satuanGudang.services', [])
.factory('satuanGudangFactory', ['$resource', function($resource) {
	return $resource('http://104.155.237.40:3000/purchasing/satuangudang/:id', {}, {
		'get': {method:'GET', params:{id: '@satuan'}},
		'update': {method:'PUT', params:{id: '@satuan'}},
		'delete': {method:'DELETE', params:{id: '@satuan'}}
	});
}]);
