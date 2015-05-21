angular.module('supplier.services', []).factory('supplierFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://localhost:3000/purchasing/supplier/:id";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/supplier/:id";
            break;
        case "production":
            url = "http://192.168.15.95:8080/PurchasingApp/purchasing/supplier/:id";
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
