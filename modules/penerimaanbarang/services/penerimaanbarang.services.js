angular.module('penerimaanBarang.services', []).factory('penerimaanBarangFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://192.168.15.248:3000/purchasing/penerimaanbarang/:id";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/penerimaanbarang/:id";
            break;
        case "production":
            url = "http://192.168.15.253:8080/PurchasingApp/purchasing/lpb/:id";
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
