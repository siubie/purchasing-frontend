angular.module("permintaanBarang.controllers", []).controller("permintaanBarangController", function($filter, $modal, $scope, $window, barangFactory, katalogBarangFactory, kategoriBarangFactory, permintaanBarangFactory) {
    $scope.module = "permintaanBarang";
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
        name: "tanggal",
        header: "Tanggal",
        type: "date",
        filter: "longDate",
        grid: true,
        warning: true
    }, {
        name: "emergency",
        header: "Jenis",
        type: "emergency",
        grid: true,
        warning: true
    }, {
        name: "kategori",
        header: "Golongan",
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
    $scope.opened = {
        tanggalButuh: []
    };
    $scope.checkEditable = function(permintaanBarang) {
        switch (permintaanBarang.status) {
            case "RECEIVED":
                permintaanBarang.editable = true;
                break;
            default:
                permintaanBarang.editable = false;
        }
        return permintaanBarang;
    };
    $scope.query = function() {
        $scope.barangs = barangFactory.query();
        $scope.kategoriBarangs = kategoriBarangFactory.query(function() {
            $scope.kategoriBarangArray = [];
            angular.forEach($scope.kategoriBarangs, function(kategoriBarang) {
                $scope.kategoriBarangArray.push(kategoriBarang.kode);
            });
            $scope.kategoriBarangArray.sort();
        });
        $scope.katalogBarangs = katalogBarangFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query(function() {
            angular.forEach($scope.permintaanBarangs, function(permintaanBarang) {
                permintaanBarang = $scope.checkEditable(permintaanBarang);
            });
        });
        $scope.items = $scope.permintaanBarangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.permintaanBarang = permintaanBarangFactory.get({
            id: id
        }, function() {
            $scope.permintaanBarang = $scope.checkEditable($scope.permintaanBarang);
            angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
                var minDate = new Date($scope.permintaanBarang.tanggal);
                if (minDate.getDate() >= 25) {
                    minDate.setMonth(minDate.getMonth() + 1);
                }
                minDate.setDate(25 + itemBarang.leadTime);
                itemBarang.minDate = minDate;
            });
        });
    };
    $scope.new = function() {
        $scope.permintaanBarang = new permintaanBarangFactory({
            nomor: "SPP" + new Date().getTime(),
            tanggal: new Date(),
            emergency: false,
            status: "RECEIVED",
            sppItemsList: [],
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
        warning = warning + "Data Permintaan Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            if (field.warning && angular.isDefined($scope.permintaanBarang[field.name])) {
                switch (field.type) {
                    case "string":
                        warning = warning + field.header + " : " + $scope.permintaanBarang[field.name] + "\n";
                        break;
                    case "date":
                        warning = warning + field.header + " : " + $filter('date')($scope.permintaanBarang[field.name], field.filter) + "\n";
                        break;
                    case "emergency":
                        if ($scope.permintaanBarang[field.name]) {
                            warning = warning + "Jenis : EMERGENCY\n";
                        } else {
                            warning = warning + "Jenis : RUTIN\n";
                        }
                        break;
                }
            }
        });
        warning = warning + "Item Barang : \n";
        angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang, i) {
            warning = warning + "     " + (i + 1) + ". " + itemBarang.barang.nama + " " + itemBarang.jumlah + " " + itemBarang.barang.satuan + "\n";
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.permintaanBarang.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Permintaan Barang Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.permintaanBarang.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Permintaan Barang Telah Diubah...");
            });
        }
    };
    $scope.delete = function(permintaanBarang) {
        if (!!permintaanBarang) {
            $scope.permintaanBarang = permintaanBarang;
        }
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            $scope.permintaanBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Permintaan Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.approve = function() {
        var confirm = $window.confirm($scope.warning("approve"));
        if (confirm) {
            $scope.permintaanBarang.status = "APPROVED";
            angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
                itemBarang.status = "APPROVED";
            });
            $scope.permintaanBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Permintaan Barang Telah Disetujui...");
                $scope.query();
            });
        }
    };
    $scope.reject = function() {
        var confirm = $window.confirm($scope.warning("reject"));
        if (confirm) {
            $scope.permintaanBarang.status = "REJECTED";
            angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
                itemBarang.status = "REJECTED";
            });
            $scope.permintaanBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Permintaan Barang Telah Ditolak...");
                $scope.query();
            });
        }
    };
    $scope.updateStatus = function() {
        var confirm = $window.confirm($scope.warning("updateStatus"));
        if (confirm) {
            var allRejected = 0;
            angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
                switch (itemBarang.status) {
                    case "APPROVED":
                        $scope.permintaanBarang.status = "APPROVED";
                        break;
                    case "REJECTED":
                        allRejected++;
                        break;
                }
            });
            if (allRejected == $scope.permintaanBarang.sppItemsList.length) {
                $scope.permintaanBarang.status = "REJECTED";
            }
            $scope.permintaanBarang.$update(function() {
                $scope.modalInstance.close("approve");
                toastr.success("Data Permintaan Barang Telah Disahkan...");
            });
        }
    };
    $scope.getHarga = function(kodeBarang) {
        var newestHarga = new Date("1970-01-01");
        var harga = 0;
        angular.forEach($scope.katalogBarangs, function(katalogBarang) {
            if (katalogBarang.barang.kode == kodeBarang && !!katalogBarang.historyHarga) {
                angular.forEach(katalogBarang.historyHarga, function(itemHarga) {
                    itemHarga.tanggal = new Date(itemHarga.tanggal);
                    if (itemHarga.tanggal.getTime() > newestHarga.getTime()) {
                        harga = itemHarga.harga;
                        newestHarga = new Date(itemHarga.tanggal.getTime());
                    }
                });
            }
        });
        return harga;
    };
    $scope.getLeadTime = function(kodeBarang) {
        var leadTime = 0;
        angular.forEach($scope.katalogBarangs, function(katalogBarang) {
            if ((katalogBarang.barang.kode == kodeBarang) && (katalogBarang.leadTime > leadTime)) {
                leadTime = katalogBarang.leadTime;
            }
        });
        return leadTime;
    };
    $scope.getMinDate = function(leadTime) {
        var minDate = new Date($scope.permintaanBarang.tanggal);
        if (minDate.getDate() >= 25) {
            minDate.setMonth(minDate.getMonth() + 1);
        }
        minDate.setDate(25 + leadTime);
        return minDate;
    };
    $scope.getBarangs = function(kategori) {
        var barangs = [];
        angular.forEach($scope.katalogBarangs, function(katalogBarang) {
            if (katalogBarang.barang.kategori == kategori) {
                barangs.push(katalogBarang.barang);
            }
        });
        barangs = $filter("unique")(barangs, "kode");
        return barangs;
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.addDetail();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(permintaanBarang) {
        $scope.get(permintaanBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/detail-permintaanbarang.views.html",
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
                $scope.openUpdate(permintaanBarang);
            }
        });
    };
    $scope.openUpdate = function(permintaanBarang) {
        $scope.newForm = false;
        $scope.get(permintaanBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.addDetail = function(index) {
        $scope.permintaanBarang.sppItemsList.push({
            tanggalButuh: new Date(),
            jumlah: 1,
            sisa: 1,
            status: "RECEIVED",
            hargaKatalog: 0,
            editable: true
        });
    };
    $scope.removeDetail = function(index) {
        $scope.permintaanBarang.sppItemsList.splice(index, 1);
    };
    $scope.itemEditable = function(sppItemsList) {
        angular.forEach(sppItemsList, function(itemBarang) {
            if (itemBarang.editable) {
                return true;
            }
        });
    };
    $scope.openTanggalButuh = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened.tanggalButuh[index] = true;
    };
    $scope.validateApproval = function(value) {
        if (value != 'RECEIVED') {
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
    $scope.$watch("permintaanBarang.kategori", function(newKategori, oldKategori) {
        if (!!oldKategori && (oldKategori != newKategori)) {
            $scope.permintaanBarang.sppItemsList = [];
            $scope.addDetail();
        }
    });
});