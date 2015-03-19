angular.module('katalogBarang.services', []).factory('katalogBarangFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/katalogBarang/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/katalogBarang/:id', {}, {
        'get': {
            method: 'GET',
            params: {
                id: '@barang.kode'
            }
        },
        'update': {
            method: 'PUT',
            params: {
                id: '@barang.kode'
            }
        },
        'delete': {
            method: 'DELETE',
            params: {
                id: '@barang.kode'
            }
        }
    });
}]);