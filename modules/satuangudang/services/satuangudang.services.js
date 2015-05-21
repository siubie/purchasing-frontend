angular.module('satuanGudang.services', []).factory('satuanGudangFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://localhost:3000/purchasing/satuangudang/:id";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/satuangudang/:id";
            break;
        case "production":
            url = "http://192.168.15.95:8080/PurchasingApp/purchasing/satuan/:id";
            break;
    }
    return $resource(url, {}, {
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
});
