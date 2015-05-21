angular.module("permintaanBarang.controllers", []).controller("permintaanBarangController", function($scope, $window, $state, $modal, $filter, barangFactory, departemenFactory, kategoriBarangFactory, permintaanBarangFactory) {
    $scope.module = "permintaanBarang";
    $scope.access = {
        create: false,
        update: true,
        delete: true,
        expand: true,
        selection: true,
        cart: true
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
        name: "jenis",
        header: "Jenis",
        type: "jenis",
        grid: true,
        warning: true
    }, {
        name: "kategori",
        header: "Kategori",
        type: "array",
        grid: true,
        warning: true
    }, {
        name: "periode",
        header: "Periode",
        type: "periode",
        grid: true,
        warning: true
    }, {
        name: "status",
        header: "Status",
        type: "string",
        grid: true,
        warning: false
    }];
    $scope.cartFields = [{
        name: "spp",
        type: "string",
        header: "Nomor SPP"
    }, {
        name: "barang.kode",
        type: "string",
        header: "Kode Barang"
    }, {
        name: "barang.nama",
        type: "string",
        header: "Nama Barang"
    }, {
        name: "qty",
        type: "String",
        header: "Jumlah SPP",
    }];
    $scope.search = {
        kategori: "KOM",
        status: ""
    };
    $scope.sort = {
        field: "nomor",
        order: true
    };
    $scope.cart = [];
    $scope.timestamp = {
        periode: new Date()
    };
    $scope.opened = {
        periode: false,
        tanggalButuh: []
    };
    $scope.query = function() {
        $scope.barangs = barangFactory.query();
        $scope.departemens = departemenFactory.query();
        $scope.kategoriBarangs = kategoriBarangFactory.query(function() {
            $scope.kategoriBarangArray = [];
            angular.forEach($scope.kategoriBarangs, function(kategoriBarang) {
                $scope.kategoriBarangArray.push(kategoriBarang.kode);
            });
            $scope.kategoriBarangArray.sort();
        });
        $scope.permintaanBarangs = permintaanBarangFactory.query(function() {
            angular.forEach($scope.permintaanBarangs, function(permintaanBarang) {
                switch (permintaanBarang.status) {
                    case "APPROVED":
                    case "REJECTED":
                        permintaanBarang.editable = false;
                        break;
                    default:
                        permintaanBarang.editable = true;
                }
                angular.forEach(permintaanBarang.sppItemsList, function(itemBarang) {
                    switch (itemBarang.status) {
                        case "APPROVED":
                        case "REJECTED":
                            itemBarang.editable = false;
                            break;
                        default:
                            itemBarang.editable = true;
                    }
                });
            });
        });
        $scope.items = $scope.permintaanBarangs;
        if (!!$scope.page) {
            $scope.page.expandedAll = false;
        }
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.permintaanBarang = permintaanBarangFactory.get({
            id: id
        }, function() {
            switch ($scope.permintaanBarang.status) {
                case "APPROVED":
                case "REJECTED":
                    $scope.permintaanBarang.editable = false;
                    break;
                default:
                    $scope.permintaanBarang.editable = true;
            }
            angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
                var minDate = new Date($scope.permintaanBarang.tanggal);
                if (minDate.getDate() >= 25) {
                    minDate.setMonth(minDate.getMonth() + 1);
                }
                minDate.setDate(25 + itemBarang.leadTime);
                itemBarang.minDate = minDate;
                switch (itemBarang.status) {
                    case "APPROVED":
                    case "REJECTED":
                        itemBarang.editable = false;
                        break;
                    default:
                        itemBarang.editable = true;
                }
            });
        });
    };
    if (!!localStorage.permintaanBarangCart) {
        $scope.cart = JSON.parse(localStorage.permintaanBarangCart);
    }
    $scope.new = function() {
        $scope.permintaanBarang = new permintaanBarangFactory({
            nomor: "SPP" + new Date().getTime(),
            tanggal: $filter("date")(new Date(), "yyyy-MM-dd"),
            jenis: false,
            periode: $filter("date")($scope.timestamp.periode, "MM-yyyy"),
            status: "RECEIVED",
            sppItemsList: [],
            editable: true
        });
        if (!!$scope.cartSystem && !!localStorage.katalogBarangCart) {
            $scope.katalogBarang = JSON.parse(localStorage.katalogBarang);
            $scope.permintaanBarang.kategori = $scope.katalogBarang.kategori;
            $scope.katalogBarangCart = JSON.parse(localStorage.katalogBarangCart);
            angular.forEach($scope.katalogBarangCart, function(itemBarang) {
                var minDate = new Date($scope.permintaanBarang.tanggal);
                if (minDate.getDate() >= 25) {
                    minDate.setMonth(minDate.getMonth() + 1);
                }
                minDate.setDate(25 + itemBarang.leadTime);
                $scope.permintaanBarang.sppItemsList.push({
                    barang: itemBarang.barang,
                    tanggalButuh: $filter("date")(minDate, "yyyy-MM-dd"),
                    leadTime: itemBarang.leadTime,
                    minDate: minDate,
                    jumlah: 1,
                    sisa: 1,
                    status: "RECEIVED",
                    harga: itemBarang.harga,
                    editable: true
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
        warning = warning + "Data Permintaan Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            if (field.warning && !!$scope.permintaanBarang[field.name]) {
                warning = warning + field.header + " : " + $scope.permintaanBarang[field.name] + "\n";
            }
        });
        warning = warning + "Item Barang : \n";
        angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang, i) {
            warning = warning + "\t\t\t" + (i+1) + ". " + itemBarang.barang.nama + " " + itemBarang.jumlah + " " + itemBarang.barang.satuan + "\n";
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
        $scope.permintaanBarang = permintaanBarang;
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            permintaanBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Permintaan Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.approveAllItem = function(permintaanBarang) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            permintaanBarang.status = "APPROVED";
            angular.forEach(permintaanBarang.sppItemsList, function(itemBarang) {
                if (itemBarang.editable) {
                    itemBarang.status = "APPROVED";
                }
            });
            permintaanBarang.$update(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Semua Item Permintaan Barang Telah Disetujui...");
                $scope.query();
            });
        }
    };
    $scope.rejectAllItem = function(permintaanBarang) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            permintaanBarang.status = "REJECTED";
            angular.forEach(permintaanBarang.sppItemsList, function(itemBarang) {
                if (itemBarang.editable) {
                    itemBarang.status = "REJECTED";
                }
            });
            permintaanBarang.$update(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Semua Item Permintaan Barang Telah Ditolak...");
                $scope.query();
            });
        }
    };
    $scope.approveItem = function(permintaanBarang, itemBarangToApprove) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            permintaanBarang.status = "APPROVED";
            angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
                if (itemBarang === itemBarangToApprove) {
                    itemBarang.status = "APPROVED";
                }
            });
            permintaanBarang.$update(function() {
                toastr.success("Item Permintaan Barang Telah Disetujui...");
                $scope.query();
                $scope.get(permintaanBarang.nomor);
            });
        }
    };
    $scope.rejectItem = function(permintaanBarang, itemBarangToReject) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        var allRejected = 0;
        if (confirm) {
            angular.forEach(permintaanBarang.sppItemsList, function(itemBarang) {
                if (itemBarang.status == "REJECTED") {
                    allRejected++;
                }
                if (itemBarang === itemBarangToReject) {
                    itemBarang.status = "REJECTED";
                    allRejected++;
                }
                if (allRejected == permintaanBarang.sppItemsList.length) {
                    permintaanBarang.status = "REJECTED";
                }
            });
            permintaanBarang.$update(function() {
                toastr.success("Item Permintaan Barang Telah Ditolak...");
                $scope.query();
                $scope.get(permintaanBarang.nomor);
            });
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.cartSystem = false;
        $scope.new();
        $scope.addDetail();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
            size: "lg",
            backdrop: "static",
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
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
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
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.addDetail = function(index) {
        $scope.permintaanBarang.sppItemsList.push({
            tanggalButuh: $filter("date")(new Date(), "yyyy-MM-dd"),
            jumlah: 1,
            sisa: 1,
            status: "RECEIVED",
            harga: 0,
            editable: true
        });
    };
    $scope.removeDetail = function(index) {
        $scope.permintaanBarang.sppItemsList.splice(index, 1);
    };
    $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened.periode = true;
    };
    $scope.openTanggalButuh = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened.tanggalButuh[index] = true;
    };
    $scope.openCreatePesananBarang = function() {
        $scope.newForm = true;
        $scope.cartSystem = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/pesananbarang/views/form-pesananbarang.views.html",
            size: "lg",
            backdrop: "static",
            controller: "pesananBarangController",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.uncheckAll();
        });
    };
    $scope.$watch("timestamp.periode", function() {
        $scope.permintaanBarang.periode = $filter("date")($scope.timestamp.periode, "MM-yyyy");
    });
    $scope.$watch("permintaanBarang.kategori", function(newKategori, oldKategori) {
        if ((!!oldKategori && !!newKategori) && (oldKategori != newKategori)) {
            $scope.permintaanBarang.sppItemsList = [];
            $scope.addDetail();
        }
    });
    // $scope.$watchCollection("permintaanBarang.sppItemsList", function() {
    //     angular.forEach($scope.permintaanBarang.sppItemsList, function(itemBarang) {
    //         itemBarang.tanggalButuh = $filter("date")(itemBarang.tanggalButuh, "yyyy-MM-dd");
    //     });
    // }, true);
});
