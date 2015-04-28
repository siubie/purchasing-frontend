angular.module('waste.services', []).factory('wasteFactory', ['$resource', function($resource) {
    return $resource('http://dev.disyam.com:3000/purchasing/waste/:id', {}, {
        // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/waste/:id', {}, {
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