angular.module('pesananBarang.services', []).factory('pesananBarangFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://localhost:3000/purchasing/pesananbarang/:id";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/pesananbarang/:id";
            break;
        case "production":
            url = "http://192.168.15.95:8080/PurchasingApp/purchasing/sp/:id";
            break;
    }
    return $resource(url, {}, {
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
});
