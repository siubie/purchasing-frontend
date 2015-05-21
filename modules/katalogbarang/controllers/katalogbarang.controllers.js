angular.module("katalogBarang.controllers", []).controller("katalogBarangController", function($scope, $window, $modal, $filter, kategoriBarangFactory, katalogBarangFactory, barangFactory, supplierFactory) {
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
        name: "kode",
        type: "string",
        header: "Kode",
        grid: true,
        warning: false
    }, {
        name: "nama",
        type: "string",
        header: "Nama",
        grid: true,
        warning: false
    }, {
        name: "kategori",
        type: "string",
        header: "Kategori",
        grid: true,
        warning: false
    }, {
        name: "satuan",
        type: "string",
        header: "Satuan",
        grid: true,
        warning: false
    }, {
        name: "barang.nama",
        type: "string",
        header: "Barang",
        grid: false,
        warning: true
    }, {
        name: "supplier.nama",
        type: "string",
        header: "Supplier",
        grid: false,
        warning: true
    }, {
        name: "alias",
        type: "string",
        header: "Alias",
        grid: false,
        warning: true
    }, {
        name: "leadTime",
        type: "string",
        header: "Lead Time",
        grid: false,
        warning: true
    }];
    $scope.cartFields = [{
        name: "barang.kode",
        type: "string",
        header: "Kode"
    }, {
        name: "barang.kategori",
        type: "string",
        header: "Kategori"
    }, {
        name: "barang.nama",
        type: "string",
        header: "Nama Barang"
    }, {
        name: "barang.satuan",
        type: "string",
        header: "Satuan",
    }];
    $scope.search = {
        "kategori": "KOM"
    };
    $scope.sort = {
        field: "kode",
        order: false,
        detailField: "hargaSupplier.tanggal",
        detailOrder: false
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query(function() {
            $scope.kategoriBarangArray = [];
            angular.forEach($scope.kategoriBarangs, function(kategoriBarang) {
                $scope.kategoriBarangArray.push(kategoriBarang.kode);
            });
            $scope.kategoriBarangArray.sort();
        });
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
    $scope.warning = function(process) {
        var warning = "Anda Akan ";
        switch (process) {
            case "create":
                warning = warning + "Membuat ";
                break;
            case "update":
                warning = warning + "Mengubah ";
                break;
            case "delete":
                warning = warning + "Menghapus ";
                break;
        }
        warning = warning + "Data Katalog Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            var fieldName = field.name.split('.');
            if (field.warning) {
                switch (fieldName.length) {
                    case 1:
                        if (!!$scope.katalogBarang[field.name]) {
                            warning = warning + field.header + " : " + $scope.katalogBarang[field.name] + "\n";
                        }
                        break;
                    case 2:
                        if (!!$scope.katalogBarang[fieldName[0]][fieldName[1]]) {
                            warning = warning + field.header + " : " + $scope.katalogBarang[fieldName[0]][fieldName[1]] + "\n";
                        }
                        break;
                }
            }
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.katalogBarang.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Katalog Barang Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.katalogBarang.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Katalog Barang Telah Diubah...");
            });
        }
    };
    $scope.delete = function(katalogBarang) {
        $scope.katalogBarang = katalogBarang;
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            katalogBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                    toastr.success("Data Katalog Barang Telah Dihapus...");
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
