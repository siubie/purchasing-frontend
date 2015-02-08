angular.module('departemen.services', []).factory('departemenFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/departemen/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/departemen/:id', {}, {
        'get': {
            method: 'GET',
            params: {
                id: '@kode'
            }
        },
        'update': {
            method: 'PUT',
            params: {
                id: '@kode'
            }
        },
        'delete': {
            method: 'DELETE',
            params: {
                id: '@kode'
            }
        }
    });
}]);
