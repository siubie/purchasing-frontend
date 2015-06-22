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
    var checkEditable = function(returBarang) {
        switch (returBarang.status) {
            case "NEW":
                returBarang.editable = true;
                break;
            default:
                returBarang.editable = false;
        }
        return returBarang;
    };
    $scope.query = function() {
        $scope.penerimaanBarangs = penerimaanBarangFactory.query();
        $scope.returBarangs = returBarangFactory.query(function() {
            angular.forEach($scope.returBarangs, function(returBarang) {
                returBarang = checkEditable(returBarang);
            });
        });
        $scope.items = $scope.returBarangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.returBarang = returBarangFactory.get({
            id: id
        }, function() {
            $scope.returBarang = checkEditable($scope.returBarang);
        });
    };
    $scope.new = function(penerimaanBarang) {
        $scope.returBarang = new returBarangFactory({
            nomor: "LPBR" + new Date().getTime(),
            tanggalBuat: new Date(),
            status: "NEW",
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
            angular.forEach(penerimaanBarang.lpbItemsList, function(itemBarang) {
                $scope.returBarang.returItemsList.push({
                    barang: itemBarang.barang,
                    satuan: itemBarang.satuan,
                    jumlahDatang: itemBarang.jumlah,
                    jumlahRetur: 1,
                    harga: itemBarang.harga,
                    status: "NEW"
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
            case "approve":
                warning = warning + "Menyetujui ";
                break;
            case "reject":
                warning = warning + "Menolak ";
                break;
            case "updateStatus":
                warning = warning + "Mengesahkan ";
                break;
        }
        warning = warning + "Data Retur Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            var fieldName = field.name.split(".");
            if (field.warning) {
                switch (fieldName.length) {
                    case 1:
                        if (angular.isDefined($scope.returBarang[field.name])) {
                            switch (field.type) {
                                case "string":
                                    warning = warning + field.header + " : " + $scope.returBarang[field.name] + "\n";
                                    break;
                                case "date":
                                    warning = warning + field.header + " : " + $filter('date')($scope.returBarang[field.name], field.filter) + "\n";
                                    break;
                            }
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
        if (!!returBarang) {
            $scope.returBarang = returBarang;
        }
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            $scope.returBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Retur Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.approve = function() {
        var confirm = $window.confirm($scope.warning("approve"));
        if (confirm) {
            $scope.returBarang.status = "APPROVED";
            angular.forEach($scope.returBarang.returItemsList, function(itemBarang) {
                itemBarang.status = "APPROVED";
            });
            $scope.returBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Penerimaan Barang Telah Disetujui...");
                $scope.query();
            });
        }
    };
    $scope.reject = function() {
        var confirm = $window.confirm($scope.warning("reject"));
        if (confirm) {
            $scope.returBarang.status = "REJECTED";
            angular.forEach($scope.returBarang.returItemsList, function(itemBarang) {
                itemBarang.status = "REJECTED";
            });
            $scope.returBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Penerimaan Barang Telah Ditolak...");
                $scope.query();
            });
        }
    };
    $scope.updateStatus = function() {
        var confirm = $window.confirm($scope.warning("updateStatus"));
        if (confirm) {
            var allRejected = 0;
            angular.forEach($scope.returBarang.returItemsList, function(itemBarang) {
                switch (itemBarang.status) {
                    case "APPROVED":
                        $scope.returBarang.status = "APPROVED";
                        break;
                    case "REJECTED":
                        allRejected++;
                        break;
                }
            });
            if (allRejected == $scope.returBarang.returItemsList.length) {
                $scope.returBarang.status = "REJECTED";
            }
            $scope.returBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Penerimaan Barang Telah Disahkan...");
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
            windowClass: "app-modal-window",
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
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function(reason) {
            if (reason == "approve") {
                $scope.query();
            }
        }, function(reason) {
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
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.validateApproval = function(value) {
        if (value != "NEW") {
            return true;
        } else {
            return false;
        }
    };
    $scope.validateNumber = function(value) {
        if (value > 0) {
            return true;
        } else {
            return false;
        }
    };
    $scope.removeDetail = function(index) {
        $scope.returBarang.returItemsList.splice(index, 1);
    };
});