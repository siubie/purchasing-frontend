angular.module("barang.controllers", []).controller("barangController", function($modal, $scope, $window, barangFactory, jenisBarangFactory, kategoriBarangFactory, satuanGudangFactory) {
    $scope.module = "barang";
    $scope.access = {
        create: true,
        update: true,
        delete: true
    };
    $scope.fields = [{
        name: "kode",
        type: "string",
        header: "Kode",
        grid: true,
        warning: true
    }, {
        name: "kategori",
        type: "string",
        header: "Kategori",
        grid: true,
        warning: true
    }, {
        name: "jenis",
        type: "string",
        header: "Jenis",
        grid: true,
        warning: true
    }, {
        name: "nama",
        type: "string",
        header: "Nama",
        grid: true,
        warning: true
    }, {
        name: "satuan",
        type: "string",
        header: "Satuan",
        grid: true,
        warning: true
    }, {
        name: "spesifikasi",
        type: "string",
        header: "Spesifikasi",
        grid: false,
        warning: true
    }, {
        name: "deskripsi",
        type: "string",
        header: "Deskripsi",
        grid: false,
        warning: false
    }];
    $scope.sort = {
        field: "nama",
        order: false
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.jenisBarangs = jenisBarangFactory;
        $scope.satuanGudangs = satuanGudangFactory.query(function() {
            $scope.satuanGudangArray = [];
            angular.forEach($scope.satuanGudangs, function(satuanGudang) {
                $scope.satuanGudangArray.push(satuanGudang.satuan);
            });
            $scope.satuanGudangArray.sort();
        });
        $scope.barangs = barangFactory.query(function() {
            angular.forEach($scope.barangs, function(barang) {
                barang.editable = true;
            });
        });
        $scope.items = $scope.barangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.barang = barangFactory.get({
            id: id
        }, function() {
            $scope.spesifikasi = {};
            $scope.barang.editable = true;
        });
    };
    $scope.new = function() {
        $scope.barang = new barangFactory({
            kode: "BRG" + new Date().getTime(),
            editable: true
        });
        $scope.spesifikasi = {};
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
        warning = warning + "Data Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "kode") {
                field.warning = false;
            }
            if (field.warning && !!$scope.barang[field.name]) {
                warning = warning + field.header + " : " + $scope.barang[field.name] + "\n";
            }
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.barang.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Barang Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.barang.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Barang Telah Diubah...");
            });
        }
    };
    $scope.delete = function(barang) {
        if (!$scope.barang.nama) {
            $scope.barang = barang;
        }
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            barang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.changeView = function(view) {
        $scope.view = view;
    };
    $scope.openCreate = function() {
        $scope.view = "create";
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(barang) {
        $scope.view = "read";
        $scope.get(barang.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(barang);
            }
        });
    };
    $scope.openUpdate = function(barang) {
        $scope.view = "update";
        $scope.get(barang.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.$watch("barang.kategori", function(newKategori, oldKategori) {
        if (!!oldKategori && !!newKategori) {
            delete $scope.barang.jenis;
        }
    });
});
