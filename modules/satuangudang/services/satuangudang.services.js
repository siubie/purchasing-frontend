angular.module('satuanGudang.services', []).factory('satuanGudangFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/satuangudang/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/satuan/:id', {}, {
        'update': {
            method: 'PUT',
            params: {
                id: '@satuan'
            }
        },
        'delete': {
            method: 'DELETE',
            params: {
                id: '@satuan'
            }
        }
    });
}]);