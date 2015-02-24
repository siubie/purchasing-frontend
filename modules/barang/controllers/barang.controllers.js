angular.module('barang.controllers', []).controller('barangController', ['$scope', '$window', '$state', '$modal', '$filter', 'satuanGudangFactory', 'kategoriBarangFactory', 'barangFactory', function($scope, $window, $state, $modal, $filter, satuanGudangFactory, kategoriBarangFactory, barangFactory) {
    $scope.module = "barang";
    $scope.fields = [{
        "name": "kode",
        "type": "string",
        "header": "Kode"
    }, {
        "name": "kategori",
        "type": "string",
        "header": "kategori"
    }, {
        "name": "nama",
        "type": "string",
        "header": "Nama"
    }, {
        "name": "alias",
        "type": "string",
        "header": "Alias"
    }, {
        "name": "satuan",
        "type": "string",
        "header": "Satuan"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "kode",
        "order": false
    };
    $scope.new = function() {
        $scope.barang = new barangFactory();
    };
    $scope.load = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.barangs = barangFactory.query();
        $scope.items = $scope.barangs;
        $scope.new();
    };
    $scope.load();
    $scope.create = function() {
        $scope.barang.$save(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.update = function() {
        $scope.barang.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(barang) {
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            barang.$delete(function() {
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
            templateUrl: 'modules/barang/views/form-barang.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openRead = function(barang) {
        $scope.close();
        $scope.newForm = false;
        $scope.barang = angular.copy(barang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/barang/views/detail-barang.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(barang) {
        $scope.close();
        $scope.newForm = false;
        $scope.barangOld = angular.copy(barang);
        $scope.barang = angular.copy(barang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/barang/views/form-barang.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.createPermintaanBarang = function() {
        $scope.newForm = true;
        $scope.close();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanbarang/views/form-permintaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: 'permintaanBarangController',
            scope: $scope
        });
        $scope.close();
    };
}]);