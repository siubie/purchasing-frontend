angular.module('permintaanBarang.services', []).factory('permintaanBarangFactory', ['$resource', function($resource) {
    return $resource('http://104.155.237.40:3000/purchasing/permintaanbarang/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/spp/:id', {}, {
        'get': {
            method: 'GET',
            params: {
                id: '@nomor'
            }
        },
        'update': {
            method: 'PUT',
            params: {
                id: '@nomor'
            }
        },
        'delete': {
            method: 'DELETE',
            params: {
                id: '@nomor'
            }
        }
    });
}]);