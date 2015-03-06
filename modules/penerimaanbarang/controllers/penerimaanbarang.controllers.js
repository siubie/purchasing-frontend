angular.module('penerimaanBarang.controllers', []).controller('penerimaanBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'supplierFactory', 'permintaanBarangFactory', 'penerimaanBarangFactory', function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, penerimaanBarangFactory) {
    $scope.module = "penerimaanBarang";
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
        $scope.penerimaanBarang = new penerimaanBarangFactory({
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            ppn: false,
            spItemsList: []
        });
        if (!!localStorage.permintaanBarangCart) {
            $scope.permintaanBarangCart = JSON.parse(localStorage.permintaanBarangCart);
            angular.forEach($scope.permintaanBarangCart, function(itemBarangCart) {
                $scope.penerimaanBarang.spItemsList.push({
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
        $scope.penerimaanBarangs = penerimaanBarangFactory.query();
        $scope.items = $scope.penerimaanBarangs;
    };
    $scope.load();
    $scope.create = function() {
        $scope.penerimaanBarang.$save(function() {
            $scope.load();
            $scope.close();
            $scope.clearCart();
        });
    };
    $scope.update = function() {
        $scope.penerimaanBarang.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(penerimaanBarang) {
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            penerimaanBarang.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.close();
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/penerimaanBarang/views/form-penerimaanBarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openRead = function(penerimaanBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.penerimaanBarang = angular.copy(penerimaanBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/penerimaanBarang/views/detail-penerimaanBarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(penerimaanBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.penerimaanBarang = angular.copy(penerimaanBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/penerimaanBarang/views/form-penerimaanBarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.removeDetail = function(index) {
        $scope.penerimaanBarang.sppItemsList.splice(index, 1);
    };
}]);