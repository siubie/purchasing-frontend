angular.module('barang.services', []).factory('barangFactory', ['$resource', function($resource) {
    // return $resource('http://104.155.237.40:3000/purchasing/barang/:id', {}, {
    return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/barang/:id', {}, {
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