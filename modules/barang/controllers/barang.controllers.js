angular.module("barang.controllers", []).controller("barangController", function($modal, $scope, $window, barangFactory, kategoriBarangFactory, satuanGudangFactory, spesifikasiFactory) {
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
    $scope.spesifikasiFields = {
        BNG: [{
            name: "jenis",
            type: "select",
            header: "Jenis",
            required: true
        }, {
            name: "sistemNomor",
            type: "select",
            header: "Sistem Penomoran",
            required: true
        }, {
            name: "nomor",
            type: "text",
            header: "Nomor Benang",
            required: true
        }, {
            name: "proses",
            type: "select",
            header: "Proses",
            required: false
        }],
        KIM: [{
            name: "jenis",
            type: "select",
            header: "Jenis",
            required: true
        }, {
            name: "brand",
            type: "text",
            header: "Brand",
            required: true
        }, {
            name: "warna",
            type: "text",
            header: "Warna",
            required: false
        }, {
            name: "keterangan",
            type: "text",
            header: "Keterangan",
            required: false
        }]
    };
    $scope.sort = {
        field: "nama",
        order: false
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.spesifikasiData = spesifikasiFactory;
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
    $scope.setForm = function(form) {
        $scope.barangForm = form;
    };
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
    $scope.changeSpesifikasi = function(spec, formName) {
        if (!spec) {
            $scope.spesifikasi[formName] = "";
        }
        switch ($scope.barang.kategori) {
            case "BNG":
                $scope.barang.nama = "";
                if (!!$scope.spesifikasi.jenis) {
                    $scope.barang.nama = $scope.barang.nama + $scope.spesifikasi.jenis;
                }
                if (!!$scope.spesifikasi.sistemNomor && $scope.spesifikasi.sistemNomor != "D") {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.sistemNomor;
                }
                if (!!$scope.spesifikasi.nomor) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.nomor;
                }
                if (!!$scope.spesifikasi.sistemNomor && $scope.spesifikasi.sistemNomor == "D") {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.sistemNomor;
                }
                if (!!$scope.spesifikasi.proses) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.proses;
                }
                $scope.barang.jenis = $scope.spesifikasi.jenis;
                break;
            case "KIM":
                $scope.barang.nama = "";
                if (!!$scope.spesifikasi.jenis) {
                    $scope.barang.nama = $scope.barang.nama + $scope.spesifikasi.jenis;
                }
                if (!!$scope.spesifikasi.brand) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.brand;
                }
                if (!!$scope.spesifikasi.warna) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.warna;
                }
                if (!!$scope.spesifikasi.keterangan) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasi.keterangan;
                }
                $scope.barang.jenis = $scope.spesifikasi.jenis;
                break;
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
            $scope.new();
            $scope.barang.kategori = newKategori;
            if (!!$scope.barangForm) {
                $scope.barangForm.$setPristine();
            }
        }
    });
});
