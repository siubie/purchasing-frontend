'use strict';

angular.module('departemenServices', [])
.factory('departemenFactory', ['$resource', function($resource) {
	return $resource('http://104.155.237.40:3000/purchasing/departemen/:id', {}, {
		'get': {method:'GET', params:{id: '@idDept'}},
		'update': {method:'PUT', params:{id: '@idDept'}},
		'delete': {method:'DELETE', params:{id: '@idDept'}}
	});
}]);