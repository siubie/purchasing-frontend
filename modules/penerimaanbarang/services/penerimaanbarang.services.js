angular.module('penerimaanBarang.services', []).factory('penerimaanBarangFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/penerimaanbarang/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/lpb/:id', {}, {
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