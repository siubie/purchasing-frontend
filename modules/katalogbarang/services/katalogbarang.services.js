angular.module("katalogBarang.services", []).factory("katalogBarangFactory", ["$resource", function($resource) {
    return $resource("http://dev.disyam.com:3000/purchasing/katalogbarang/:id1/:id2", {}, {
        // return $resource("http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/spp/:id", {}, {
        "get": {
            method: "GET",
            params: {
                id1: "@barang.kode",
                id2: "@supplier.kode"
            }
        },
        "update": {
            method: "PUT",
            params: {
                id1: "@barang.kode",
                id2: "@supplier.kode"
            }
        },
        "delete": {
            method: "DELETE",
            params: {
                id1: "@barang.kode",
                id2: "@supplier.kode"
            }
        }
    });
}]);