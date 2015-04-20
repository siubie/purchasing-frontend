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
    $scope.cartFields = [{
        "name": "barang.kode",
        "type": "string",
        "header": "Kode"
    }, {
        "name": "barang.kategori",
        "type": "string",
        "header": "Kategori"
    }, {
        "name": "barang.nama",
        "type": "string",
        "header": "Nama Barang"
    }, {
        "name": "barang.satuan",
        "type": "string",
        "header": "Satuan",
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "kode",
        "order": false,
        "detailField": "hargaSupplier.tanggal",
        "detailOrder": "false"
    };
    $scope.load = function() {
        $scope.barangs = barangFactory.query();
        $scope.suppliers = supplierFactory.query();
        $scope.katalogBarangs = katalogBarangFactory.query();
        $scope.items = $scope.barangs;
    };
    $scope.load();
    if (!!localStorage.katalogBarangCart) {
        $scope.cart = JSON.parse(localStorage.katalogBarangCart);
    }
    $scope.new = function() {
        $scope.katalogBarang = new katalogBarangFactory({
            hargaSupplier: []
        });
    };
    $scope.new();
    $scope.create = function() {
        console.log("katalogBarang : ", JSON.stringify($scope.katalogBarang));
        $scope.katalogBarang.$save(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("katalogBarang : ", JSON.stringify($scope.katalogBarang));
        $scope.katalogBarang.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(katalogBarang) {
        var confirmDelete = $window.confirm("Apakah Anda Yakin?");
        if (confirmDelete) {
            katalogBarang.$delete(function() {
                $scope.load();
                $scope.modalInstance.close();
            });
        }
    };
    $scope.openCreate = function() {
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
        $scope.modalInstance.close();
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            controller: "permintaanBarangController",
            scope: $scope
        });
        console.log($scope.modalInstance);
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
});