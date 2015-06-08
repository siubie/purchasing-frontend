angular.module("barang.services", []).factory("barangFactory", function($resource, constFactory) {
        var url = "";
        switch (constFactory.env) {
            case "local":
                url = "http://192.168.15.248:3000/purchasing/barang/:id";
                break;
            case "development":
                url = "http://dev.disyam.com:3000/purchasing/barang/:id";
                break;
            case "production":
                url = "http://192.168.15.253:8080/PurchasingApp/purchasing/barang/:id";
                break;
        }
        return $resource(url, {}, {
            "update": {
                method: "PUT",
                params: {
                    id: "@kode"
                }
            },
            "delete": {
                method: "DELETE",
                params: {
                    id: "@kode"
                }
            }
        });
    })
    .factory("jenisBarangFactory", function() {
        var jenis = {
            "BNG": [
                "ACRYLIC",
                "COTTON",
                "CVC",
                "FIBER",
                "FILAMEN",
                "MAMILON",
                "MERCERIZED",
                "MODAL",
                "MODAL COTTON",
                "MONOFILAMENT",
                "NYLON"
            ],
            "KIM": [
                "ACID DYES",
                "AUXILLIRIES",
                "BAHAN PEMBANTU"
            ],
            "KOM": [
                "CONSUMABLES",
                "NETWORK",
                "SPAREPART"
            ]
        };
        return jenis;
    });
