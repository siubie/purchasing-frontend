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
    .factory("spesifikasiFactory", function() {
        var spesifikasi = {
            "BNG": {
                "jenis": [
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
                "sistemNomor": [
                    "D",
                    "Ne",
                    "Nm",
                    "Td"
                ],
                "proses": [
                    "CARDED",
                    "COMBED",
                    "MERCERIZED"
                ],
            },
            "KIM": {
                "jenis": [
                    "ACID DYES",
                    "AUXILLIRIES",
                    "BAHAN PEMBANTU"
                ]
            }
        };
        return spesifikasi;
    });
