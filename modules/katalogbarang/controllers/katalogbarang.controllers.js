angular.module("katalogBarang.controllers", []).controller("katalogBarangController", function($scope, $window, $modal, $filter, katalogBarangFactory, barangFactory, supplierFactory) {
    $scope.module = "katalogBarang";
    $scope.access = {
        create: true,
        update: true,
        delete: true,
        expand: true,
        selection: true,
        cart: true
    };
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
    $scope.sort = {
        "field": "kode",
        "order": false,
        "detailField": "hargaSupplier.tanggal",
        "detailOrder": "false"
    };
    $scope.query = function() {
        $scope.barangs = barangFactory.query();
        $scope.suppliers = supplierFactory.query();
        $scope.katalogBarangs = katalogBarangFactory.query(function() {
            angular.forEach($scope.katalogBarangs, function(katalogBarang) {
                katalogBarang.editable = true;
            });
        });
        $scope.items = $scope.barangs;
        if (!!$scope.page) {
            $scope.page.expandedAll = false;
        }
    };
    $scope.query();
    $scope.get = function(id1, id2) {
        $scope.katalogBarang = katalogBarangFactory.get({
            id1: id1,
            id2: id2
        }, function() {
            $scope.katalogBarang.editable = true;
        });
    };
    if (!!localStorage.katalogBarangCart) {
        $scope.cart = JSON.parse(localStorage.katalogBarangCart);
    }
    $scope.new = function() {
        $scope.katalogBarang = new katalogBarangFactory({
            hargaSupplier: [],
            editable: true
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
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            katalogBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                $scope.query();
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
            $scope.query();
        });
    };
    $scope.openRead = function(katalogBarang) {
        $scope.get(katalogBarang.barang.kode, katalogBarang.supplier.kode);
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
        $scope.get(katalogBarang.barang.kode, katalogBarang.supplier.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/katalogbarang/views/form-katalogbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openCreatePermintaanBarang = function() {
        $scope.cartSystem = true;
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            controller: "permintaanBarangController",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.uncheckAll();
        });
    };
});