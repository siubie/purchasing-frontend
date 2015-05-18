angular.module('returBarang.services', []).factory('returBarangFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/returbarang/:id";
            break;
        case "production":
            url = "http://192.168.15.95:8080/PurchasingApp/purchasing/lpbr/:id";
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
