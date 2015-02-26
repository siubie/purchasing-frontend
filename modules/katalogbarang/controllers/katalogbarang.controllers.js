angular.module('katalogBarang.controllers', []).controller('katalogBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'barangFactory', 'departemenFactory', 'supplierFactory', 'katalogBarangFactory', function($scope, $window, $state, $modal, $filter, barangFactory, departemenFactory, supplierFactory, katalogBarangFactory) {
    $scope.module = "katalogBarang";
    $scope.fields = [{
        "name": "barang.nama",
        "header": "Nama Barang",
        "type": "string",
    }, {
        "name": "departemen.departemen",
        "header": "Departemen",
        "type": "string"
    }, {
        "name": "supplier.nama",
        "header": "Supplier",
        "type": "string"
    }, {
        "name": "alias",
        "header": "Alias",
        "type": "string"
    }, {
        "name": "harga",
        "header": "Harga",
        "type": "string"
    }, {
        "name": "leadTime",
        "header": "Lead Time",
        "type": "string"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "kode",
        "order": true
    };
    $scope.temp = {};
    $scope.new = function() {
        $scope.barangList = [];
        $scope.katalogBarang = new katalogBarangFactory();
        $scope.katalog = {};
        if (!!localStorage.barangCart) {
            $scope.barangCart = JSON.parse(localStorage.barangCart);
            angular.forEach($scope.barangCart, function(itemBarangCart) {
                $scope.barangList.push({
                    barang: itemBarangCart,
                    leadTime: 30,
                });
            });
        }
    };
    $scope.new();
    $scope.load = function() {
        $scope.barangs = barangFactory.query();
        $scope.departemens = departemenFactory.query();
        $scope.suppliers = supplierFactory.query();
        $scope.katalogBarangs = katalogBarangFactory.query();
        $scope.items = $scope.katalogBarangs;
    };
    $scope.load();
    $scope.create = function() {
        angular.forEach($scope.barangList, function(itemBarang, i) {
            $scope.katalogBarang = new katalogBarangFactory();
            $scope.katalogBarang.barang = itemBarang.barang;
            $scope.katalogBarang.departemen = itemBarang.departemen;
            $scope.katalogBarang.supplier = $scope.temp.supplier;
            $scope.katalogBarang.alias = itemBarang.alias;
            $scope.katalogBarang.leadTime = itemBarang.leadTime;
            $scope.katalogBarang.harga = itemBarang.harga;
            $scope.katalogBarang.$save(function() {
                if (i == $scope.barangList.length - 1) {
                    $scope.load();
                    $scope.close();
                }
            });
        });
        // $scope.clearCart();
    };
    $scope.update = function() {
        $scope.katalogBarang.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(katalogBarang) {
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            katalogBarang.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.close();
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/katalogbarang/views/create-katalogbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openRead = function(katalogBarang) {
        $scope.close();
        $scope.katalogBarang = angular.copy(katalogBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/katalogbarang/views/detail-katalogbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(katalogBarang) {
        $scope.close();
        $scope.katalogBarang = angular.copy(katalogBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/katalogbarang/views/update-katalogbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.removeDetail = function(index) {
        $scope.barangList.splice(index, 1);
    };
}]);