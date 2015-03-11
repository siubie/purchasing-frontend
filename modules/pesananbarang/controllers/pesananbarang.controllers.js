angular.module('pesananBarang.controllers', []).controller('pesananBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'supplierFactory', 'permintaanBarangFactory', 'pesananBarangFactory', function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, pesananBarangFactory) {
    $scope.module = "pesananBarang";
    $scope.fields = [{
        "name": "nomor",
        "header": "Nomor",
        "type": "string"
    }, {
        "name": "tanggal",
        "header": "Tanggal",
        "type": "date",
        "filter": "longDate"
    }, {
        "name": "supplier.nama",
        "header": "Supplier",
        "type": "string"
    }, {
        "name": "ppn",
        "header": "PPN",
        "type": "ppn"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "nomor",
        "order": true
    };
    $scope.newForm = true;
    $scope.new = function() {
        $scope.pesananBarang = new pesananBarangFactory({
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            ppn: false,
            spItemsList: []
        });
        if (!!localStorage.permintaanBarangCart) {
            $scope.permintaanBarangCart = JSON.parse(localStorage.permintaanBarangCart);
            angular.forEach($scope.permintaanBarangCart, function(itemBarangCart) {
                $scope.pesananBarang.spItemsList.push({
                    spp: itemBarangCart.spp,
                    barang: itemBarangCart.barang,
                    qty: itemBarangCart.qty,
                    diskon: 0
                });
            });
        }
    };
    $scope.new();
    $scope.load = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.pesananBarangs = pesananBarangFactory.query();
        $scope.items = $scope.pesananBarangs;
    };
    $scope.load();
    $scope.create = function() {
        $scope.pesananBarang.$save(function() {
            $scope.load();
            $scope.close();
            $scope.clearCart();
        });
    };
    $scope.update = function() {
        $scope.pesananBarang.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(pesananBarang) {
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            pesananBarang.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    // $scope.openCreate = function() {
    //     $scope.close();
    //     $scope.newForm = true;
    //     $scope.new();
    //     $scope.modalInstance = $modal.open({
    //         templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
    //         size: 'lg',
    //         backdrop: 'static',
    //         scope: $scope
    //     });
    // };
    $scope.openRead = function(pesananBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.pesananBarang = angular.copy(pesananBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/detail-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(pesananBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.pesananBarang = angular.copy(pesananBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openCreatePenerimaanBarang = function(pesananBarang) {
        $scope.close();
        $scope.newForm = true;
        modalInstance = $modal.open({
            templateUrl: 'modules/penerimaanbarang/views/form-penerimaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: "createPenerimaanBarangController",
            resolve: {
                pesananBarang: function() {
                    return pesananBarang;
                }
            }
        });
        modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.removeDetail = function(index) {
        $scope.pesananBarang.sppItemsList.splice(index, 1);
    };
}]);