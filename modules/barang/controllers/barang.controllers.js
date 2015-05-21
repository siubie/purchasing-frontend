angular.module("barang.controllers", []).controller("barangController", function($scope, $window, $modal, barangFactory, kategoriBarangFactory, satuanGudangFactory, spesifikasiFactory) {
    $scope.module = "barang";
    $scope.access = {
        create: true,
        update: true,
        delete: true,
        expand: false,
        selection: false,
        cart: false
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
        name: "spesifikasiTambahan",
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
    $scope.spesifikasiForms = {
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
        field: "kode",
        order: true
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.spesifikasi = spesifikasiFactory;
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
            $scope.spesifikasiUtama = {};
            $scope.spesifikasiUtama = angular.fromJson($scope.barang.spesifikasiUtama);
            $scope.barang.editable = true;
        });
    };
    $scope.new = function() {
        $scope.barang = new barangFactory({
            kode: "BRG" + new Date().getTime(),
            editable: true
        });
        $scope.spesifikasiUtama = {};
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
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.barang.$update(function() {
                $scope.modalInstance.close();
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
                $scope.query();
            });
        }
    };
    $scope.changeSpesifikasiUtama = function(spec, formName) {
        if (!spec) {
            $scope.spesifikasiUtama[formName] = "";
        }
        switch ($scope.barang.kategori) {
            case "BNG":
                $scope.barang.nama = "";
                if (!!$scope.spesifikasiUtama.jenis) {
                    $scope.barang.nama = $scope.barang.nama + $scope.spesifikasiUtama.jenis;
                }
                if (!!$scope.spesifikasiUtama.sistemNomor && $scope.spesifikasiUtama.sistemNomor != "D") {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.sistemNomor;
                }
                if (!!$scope.spesifikasiUtama.nomor) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.nomor;
                }
                if (!!$scope.spesifikasiUtama.sistemNomor && $scope.spesifikasiUtama.sistemNomor == "D") {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.sistemNomor;
                }
                if (!!$scope.spesifikasiUtama.proses) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.proses;
                }
                $scope.barang.jenis = $scope.spesifikasiUtama.jenis;
                $scope.barang.spesifikasiUtama = JSON.stringify($scope.spesifikasiUtama);
                break;
            case "KIM":
                $scope.barang.nama = "";
                if (!!$scope.spesifikasiUtama.jenis) {
                    $scope.barang.nama = $scope.barang.nama + $scope.spesifikasiUtama.jenis;
                }
                if (!!$scope.spesifikasiUtama.brand) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.brand;
                }
                if (!!$scope.spesifikasiUtama.warna) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.warna;
                }
                if (!!$scope.spesifikasiUtama.keterangan) {
                    $scope.barang.nama = $scope.barang.nama + " " + $scope.spesifikasiUtama.keterangan;
                }
                $scope.barang.jenis = $scope.spesifikasiUtama.jenis;
                $scope.barang.spesifikasiUtama = JSON.stringify($scope.spesifikasiUtama);
                break;
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
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
        $scope.get(barang.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/detail-barang.views.html",
            size: "md",
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
        $scope.newForm = false;
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
