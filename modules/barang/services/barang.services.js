angular.module('barang.services', []).factory('barangFactory', ['$resource', function($resource) {
        return $resource('http://dev.disyam.com:3000/purchasing/barang/:id', {}, {
            // return $resource('http://purchasing.behaestex.co.id:8080/PurchasingApp/purchasing/barang/:id', {}, {
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
    }])
    .factory('spesifikasiFactory', function() {
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