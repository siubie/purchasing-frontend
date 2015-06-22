angular.module("penerimaanBarang.controllers", []).controller("penerimaanBarangController", function($filter, $modal, $scope, $window, penerimaanBarangFactory, pesananBarangFactory) {
    $scope.module = "penerimaanBarang";
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
    $scope.newForm = true;
    $scope.opened = {
        "tanggalDatang": false
    };
    var checkEditable = function(penerimaanBarang) {
        switch (penerimaanBarang.status) {
            case "NEW":
                penerimaanBarang.editable = true;
                break;
            default:
                penerimaanBarang.editable = false;
        }
        return penerimaanBarang;
    };
    $scope.query = function() {
        $scope.pesananBarangs = pesananBarangFactory.query();
        $scope.penerimaanBarangs = penerimaanBarangFactory.query(function() {
            angular.forEach($scope.penerimaanBarangs, function(penerimaanBarang) {
                penerimaanBarang = checkEditable(penerimaanBarang);
            });
        });
        $scope.items = $scope.penerimaanBarangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.penerimaanBarang = penerimaanBarangFactory.get({
            id: id
        }, function() {
            $scope.penerimaanBarang = checkEditable($scope.penerimaanBarang);
        });
    };
    $scope.new = function(pesananBarang) {
        $scope.penerimaanBarang = new penerimaanBarangFactory({
            nomor: "LPB" + new Date().getTime(),
            tanggalBuat: new Date(),
            tanggalDatang: new Date(),
            status: "NEW",
            lpbItemsList: [],
            editable: true
        });
        if (!!pesananBarang) {
            $scope.penerimaanBarang.sp = pesananBarang.nomor;
            $scope.penerimaanBarang.supplier = pesananBarang.supplier;
            $scope.penerimaanBarang.diskon = pesananBarang.diskon;
            $scope.penerimaanBarang.kurs = pesananBarang.kurs;
            $scope.penerimaanBarang.valuta = pesananBarang.valuta;
            angular.forEach(pesananBarang.spItemsList, function(itemBarang) {
                if (itemBarang.status == "APPROVED") {
                    $scope.penerimaanBarang.lpbItemsList.push({
                        barang: itemBarang.barang,
                        satuan: itemBarang.satuan,
                        spp: itemBarang.spp,
                        jumlah: itemBarang.jumlah,
                        harga: itemBarang.harga,
                        status: "NEW",
                    });
                }
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
        warning = warning + "Data Penerimaan Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            var fieldName = field.name.split(".");
            if (field.warning) {
                switch (fieldName.length) {
                    case 1:
                        if (angular.isDefined($scope.penerimaanBarang[field.name])) {
                            switch (field.type) {
                                case "string":
                                    warning = warning + field.header + " : " + $scope.penerimaanBarang[field.name] + "\n";
                                    break;
                                case "date":
                                    warning = warning + field.header + " : " + $filter('date')($scope.penerimaanBarang[field.name], field.filter) + "\n";
                                    break;
                            }
                        }
                        break;
                    case 2:
                        if (!!$scope.penerimaanBarang[fieldName[0]][fieldName[1]]) {
                            warning = warning + field.header + " : " + $scope.penerimaanBarang[fieldName[0]][fieldName[1]] + "\n";
                        }
                        break;
                }
            }
        });
        warning = warning + "Item Barang : \n";
        angular.forEach($scope.penerimaanBarang.lpbItemsList, function(itemBarang, i) {
            warning = warning + "     " + (i + 1) + ". " + itemBarang.barang.nama + " " + itemBarang.jumlah + " " + itemBarang.barang.satuan + "\n";
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.penerimaanBarang.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Penerimaan Barang Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.penerimaanBarang.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Penerimaan Barang Telah Diubah...");
            });
        }
    };
    $scope.delete = function(penerimaanBarang) {
        if (!!penerimaanBarang) {
            $scope.penerimaanBarang = penerimaanBarang;
        }
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            $scope.penerimaanBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Penerimaan Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.approve = function() {
        var confirm = $window.confirm($scope.warning("approve"));
        if (confirm) {
            $scope.penerimaanBarang.status = "APPROVED";
            angular.forEach($scope.penerimaanBarang.lpbItemsList, function(itemBarang) {
                itemBarang.status = "APPROVED";
            });
            $scope.penerimaanBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Penerimaan Barang Telah Disetujui...");
                $scope.query();
            });
        }
    };
    $scope.reject = function() {
        var confirm = $window.confirm($scope.warning("reject"));
        if (confirm) {
            $scope.penerimaanBarang.status = "REJECTED";
            angular.forEach($scope.penerimaanBarang.lpbItemsList, function(itemBarang) {
                itemBarang.status = "REJECTED";
            });
            $scope.penerimaanBarang.$update(function() {
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
            angular.forEach($scope.penerimaanBarang.lpbItemsList, function(itemBarang) {
                switch (itemBarang.status) {
                    case "APPROVED":
                        $scope.penerimaanBarang.status = "APPROVED";
                        break;
                    case "REJECTED":
                        allRejected++;
                        break;
                }
            });
            if (allRejected == $scope.penerimaanBarang.lpbItemsList.length) {
                $scope.penerimaanBarang.status = "REJECTED";
            }
            $scope.penerimaanBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Penerimaan Barang Telah Disahkan...");
            });
        }
    };
    $scope.validateNumber = function(value) {
        if (value > 0) {
            return true;
        } else {
            return false;
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penerimaanbarang/views/form-penerimaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(penerimaanBarang) {
        $scope.get(penerimaanBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penerimaanbarang/views/detail-penerimaanbarang.views.html",
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
                $scope.openUpdate(penerimaanBarang);
            }
        });
    };
    $scope.openUpdate = function(penerimaanBarang) {
        $scope.newForm = false;
        $scope.get(penerimaanBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penerimaanbarang/views/form-penerimaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.removeDetail = function(index) {
        $scope.penerimaanBarang.lpbItemsList.splice(index, 1);
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
    $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened.tanggalDatang = true;
    };
});