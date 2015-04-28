angular.module('returBarang.services', []).factory('returBarangFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/returbarang/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/lpbr/:id', {}, {
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