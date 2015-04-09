angular.module("katalogBarang.controllers", []).controller("katalogBarangController", function($scope, $window, $modal, $filter, katalogBarangFactory, barangFactory, supplierFactory) {
    $scope.module = "katalogBarang";
    $scope.fields = [{
        "name": "kode",
        "type": "string",
        "header": "Kode"
    }, {
        "name": "nama",
        "type": "string",
        "header": "Nama"
    }, {
        "name": "kategori",
        "type": "string",
        "header": "Kategori"
    }, {
        "name": "satuan",
        "type": "string",
        "header": "Satuan"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "barang.nama",
        "order": false,
        "detailField": "hargaSupplier.tanggal",
        "detailOrder": "false"
    };
    $scope.load = function() {
        $scope.barangs = barangFactory.query(function() {
            $scope.katalogBarangs = katalogBarangFactory.query(function() {
                $scope.items = angular.copy($scope.barangs);
                angular.forEach($scope.items, function(item) {
                    item.listSupplier = [];
                    angular.forEach($scope.katalogBarangs, function(katalogBarang) {
                        if (item.kode == katalogBarang.barang.kode) {
                            item.listSupplier.push({
                                supplier: katalogBarang.supplier,
                                alias: katalogBarang.alias,
                                leadTime: katalogBarang.leadTime,
                                historyHarga: katalogBarang.historyHarga
                            });
                        }
                    });
                });
            });
        });
        $scope.suppliers = supplierFactory.query();
    };
    $scope.load();
    $scope.new = function() {
        $scope.katalogBarang = new katalogBarangFactory({
            hargaSupplier: []
        });
    };
    $scope.new();
    $scope.create = function() {
        console.log("katalogBarang : ", JSON.stringify($scope.katalogBarang));
        $scope.katalogBarang.$save(function() {
            $scope.close();
        });
    };
    $scope.update = function() {
        console.log("katalogBarang : ", JSON.stringify($scope.katalogBarang));
        $scope.katalogBarang.$update(function() {
            $scope.close();
        });
    };
    $scope.delete = function(katalogBarang) {
        var confirmDelete = $window.confirm("Apakah Anda Yakin?");
        if (confirmDelete) {
            katalogBarang.$delete(function() {
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
            templateUrl: "modules/katalogbarang/views/form-katalogbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openRead = function(katalogBarang) {
        $scope.close();
        $scope.katalogBarang = katalogBarang;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/katalogbarang/views/detail-katalogbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(katalogBarang);
            }
        });
    };
    $scope.openUpdate = function(katalogBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.katalogBarang = katalogBarang;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/katalogbarang/views/form-katalogbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openCreatePermintaanBarang = function() {
        $scope.close();
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            controller: "permintaanBarangController",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
});