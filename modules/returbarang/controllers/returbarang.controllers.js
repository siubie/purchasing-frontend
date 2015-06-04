angular.module("returBarang.controllers", []).controller("returBarangController", function($filter, $modal, $scope, $window, penerimaanBarangFactory, returBarangFactory) {
    $scope.module = "returBarang";
    $scope.access = {
        create: true,
        update: true,
        delete: true
    };
    $scope.fields = [{
        name: "nomor",
        header: "Nomor",
        type: "string",
        grid: true,
        warning: true
    }, {
        name: "tanggalDatang",
        header: "Tanggal Datang",
        type: "date",
        filter: "longDate",
        grid: true,
        warning: true
    }, {
        name: "tanggalBuat",
        header: "Tanggal Dibuat",
        type: "date",
        filter: "longDate",
        grid: true,
        warning: true
    }, {
        name: "sp",
        header: "Nomor SP",
        type: "string",
        grid: true,
        warning: true
    }, {
        name: "supplier.nama",
        header: "Supplier",
        type: "string",
        grid: true,
        warning: true
    }, {
        name: "status",
        header: "Status",
        type: "string",
        grid: true,
        warning: false
    }];
    $scope.sort = {
        field: "nomor",
        order: true
    };
    $scope.query = function() {
        $scope.penerimaanBarangs = penerimaanBarangFactory.query();
        $scope.returBarangs = returBarangFactory.query(function() {
            angular.forEach($scope.returBarangs, function(returBarang) {
                returBarang.editable = true;
            });
        });
        $scope.items = $scope.returBarangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.returBarang = returBarangFactory.get({
            id: id
        }, function() {
            $scope.returBarang.editable = true;
        });
    };
    $scope.new = function(penerimaanBarang) {
        $scope.returBarang = new returBarangFactory({
            nomor: "LPBR" + new Date().getTime(),
            tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
            status: "RECEIVED",
            returItemsList: [],
            editable: true
        });
        if (!!penerimaanBarang) {
            $scope.returBarang.tanggalDatang = penerimaanBarang.tanggalDatang;
            $scope.returBarang.lpb = penerimaanBarang.nomor;
            $scope.returBarang.sp = penerimaanBarang.sp;
            $scope.returBarang.supplier = penerimaanBarang.supplier;
            $scope.returBarang.nomorSj = penerimaanBarang.nomorSj;
            $scope.returBarang.diskon = penerimaanBarang.diskon;
            $scope.returBarang.kurs = penerimaanBarang.kurs;
            $scope.returBarang.valuta = penerimaanBarang.valuta;
            $scope.returBarang.valutaBayar = penerimaanBarang.valutaBayar;
            angular.forEach(penerimaanBarang.lpbItemsList, function(itemBarang) {
                $scope.returBarang.returItemsList.push({
                    barang: itemBarang.barang,
                    satuan: itemBarang.satuan,
                    jumlahDatang: itemBarang.jumlah,
                    jumlahRetur: 1,
                    harga: itemBarang.harga,
                    status: "RECEIVED"
                });
            });
        }
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
        warning = warning + "Data Retur Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            var fieldName = field.name.split('.');
            if (field.warning) {
                switch (fieldName.length) {
                    case 1:
                        if (!!$scope.returBarang[field.name]) {
                            warning = warning + field.header + " : " + $scope.returBarang[field.name] + "\n";
                        }
                        break;
                    case 2:
                        if (!!$scope.returBarang[fieldName[0]][fieldName[1]]) {
                            warning = warning + field.header + " : " + $scope.returBarang[fieldName[0]][fieldName[1]] + "\n";
                        }
                        break;
                }
            }
        });
        warning = warning + "Item Barang : \n";
        angular.forEach($scope.returBarang.returItemsList, function(itemBarang, i) {
            warning = warning + "     " + (i + 1) + ". " + itemBarang.barang.nama + " " + itemBarang.jumlahRetur + " " + itemBarang.barang.satuan + "\n";
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.returBarang.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Retur Barang Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.returBarang.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Retur Barang Telah Diubah...");
            });
        }
    };
    $scope.delete = function(returBarang) {
        $scope.returBarang = returBarang;
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            returBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Retur Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.input = false;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/returbarang/views/form-returbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(returBarang) {
        $scope.get(returBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/returbarang/views/detail-returbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(returBarang);
            }
        });
    };
    $scope.openUpdate = function(returBarang) {
        $scope.newForm = false;
        $scope.get(returBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/returbarang/views/form-returbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.removeDetail = function(index) {
        $scope.returBarang.returItemsList.splice(index, 1);
    };
});
