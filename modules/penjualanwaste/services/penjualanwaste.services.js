angular.module('penjualanWaste.services', []).factory('penjualanWasteFactory', function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://localhost:3000/purchasing/penjualanwaste/:id";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/penjualanwaste/:id";
            break;
        case "production":
            url = "http://192.168.15.95:8080/PurchasingApp/purchasing/fakturwaste/:id";
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
