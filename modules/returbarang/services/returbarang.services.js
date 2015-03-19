angular.module('returBarang.services', []).factory('returBarangFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/returbarang/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/lpb/:id', {}, {
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