angular.module('kategoriBarang.services', []).factory('kategoriBarangFactory', ['$resource', function($resource) {
    return $resource('http://104.155.237.40:3000/purchasing/kategoribarang/:id', {}, {
        'get': {
            method: 'GET',
            params: {
                id: '@idDept'
            }
        },
        'update': {
            method: 'PUT',
            params: {
                id: '@idDept'
            }
        },
        'delete': {
            method: 'DELETE',
            params: {
                id: '@idDept'
            }
        }
    });
}]);