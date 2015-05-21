angular.module("returBarang.controllers", []).controller("returBarangController", function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, returBarangFactory) {
    $scope.module = "returBarang";
    $scope.access = {
        create: false,
        update: true,
        delete: true,
        expand: false,
        selection: false,
        cart: false
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
    $scope.new = function() {
        if (!!localStorage.penerimaanBarang) {
            var penerimaanBarang = JSON.parse(localStorage.penerimaanBarang);
            $scope.returBarang = new returBarangFactory({
                nomor: "LPBR" + new Date().getTime(),
                tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
                tanggalDatang: penerimaanBarang.tanggalDatang,
                lpb: penerimaanBarang.nomor,
                sp: penerimaanBarang.sp,
                supplier: penerimaanBarang.supplier,
                nomorSj: penerimaanBarang.nomorSj,
                diskon: penerimaanBarang.diskon,
                kurs: penerimaanBarang.kurs,
                valuta: penerimaanBarang.valuta,
                valutaBayar: penerimaanBarang.valutaBayar,
                status: "RECEIVED",
                returItemsList: [],
                editable: true
            });
            angular.forEach(penerimaanBarang.lpbItemsList, function(itemBarang) {
                $scope.returBarang.returItemsList.push({
                    barang: itemBarang.barang,
                    qtyDatang: itemBarang.qty,
                    qtyRetur: 1,
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
            warning = warning + "\t\t\t" + (i+1) + ". " + itemBarang.barang.nama + " " + itemBarang.qtyRetur + " " + itemBarang.barang.satuan + "\n";
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.returBarang.$save(function() {
                $scope.modalInstance.close();
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.returBarang.$update(function() {
                $scope.modalInstance.close();
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
                $scope.query();
            });
        }
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
    };
    $scope.removeDetail = function(index) {
        $scope.returBarang.returItemsList.splice(index, 1);
    };
});
