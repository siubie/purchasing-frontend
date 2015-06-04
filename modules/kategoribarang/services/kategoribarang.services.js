angular.module('kategoriBarang.services', []).factory('kategoriBarangFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://192.168.15.248:3000/purchasing/kategoribarang/:id";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/kategoribarang/:id";
            break;
        case "production":
            url = "http://192.168.15.253:8080/PurchasingApp/purchasing/kategori/:id";
            break;
    }
    return $resource(url, {}, {
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
});
