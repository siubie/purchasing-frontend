angular.module("konversiSatuan.services", []).factory("konversiSatuanFactory", function($resource, constFactory) {
    var url = "";
    switch (constFactory.env) {
        case "local":
            url = "http://192.168.15.248:3000/purchasing/konversisatuan/:id1/:id2";
            break;
        case "development":
            url = "http://dev.disyam.com:3000/purchasing/konversisatuan/:id1/:id2";
            break;
        case "production":
            url = "http://192.168.15.253:8080/PurchasingApp/purchasing/konversi/:id1/:id2";
            break;
    }
    return $resource(url, {}, {
        "update": {
            method: "PUT",
            params: {
                id1: "@satuanGudang",
                id2: "@satuanKonversi"
            }
        },
        "delete": {
            method: "DELETE",
            params: {
                id1: "@satuanGudang",
                id2: "@satuanKonversi"
            }
        }
    });
});