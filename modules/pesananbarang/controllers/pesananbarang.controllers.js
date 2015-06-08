angular.module('pesananBarang.controllers', []).controller('pesananBarangController', function($filter, $http, $modal, $scope, $window, kategoriBarangFactory, supplierFactory, permintaanBarangFactory, pesananBarangFactory) {
    $scope.module = "pesananBarang";
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
        name: "supplier.nama",
        header: "Supplier",
        type: "string",
        grid: true,
        warning: true
    }, {
        name: "ppn",
        header: "PPN",
        type: "ppn",
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
    $http({
        method: "JSONP",
        url: "http://jsonrates.com/get/?base=IDR&apiKey=jr-e24ec7990c9beb15f956913c940f1ed9&callback=JSON_CALLBACK",
        timeout: "2000"
    }).success(function(response) {
        $scope.kurs = response.rates;
    }).error(function() {
        alert("Proses Mengambil data Kurs Timeout!!!");
        delete $scope.kurs;
    });
    $scope.query = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.kategoriBarangs = kategoriBarangFactory.query(function() {
            $scope.kategoriBarangArray = [];
            angular.forEach($scope.kategoriBarangs, function(kategoriBarang) {
                $scope.kategoriBarangArray.push(kategoriBarang.kode);
            });
            $scope.kategoriBarangArray.sort();
        });
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.pesananBarangs = pesananBarangFactory.query(function() {
            angular.forEach($scope.pesananBarangs, function(pesananBarang) {
                switch (pesananBarang.status) {
                    case "NEW":
                        pesananBarang.editable = true;
                        break;
                    default:
                        pesananBarang.editable = false;
                }
                angular.forEach(pesananBarang.spItemsList, function(itemBarang) {
                    switch (itemBarang.status) {
                        case "NEW":
                            itemBarang.editable = true;
                            break;
                        default:
                            itemBarang.editable = false;
                    }
                });
            });
        });
        $scope.items = $scope.pesananBarangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.pesananBarang = pesananBarangFactory.get({
            id: id
        }, function() {
            switch ($scope.pesananBarang.status) {
                case "NEW":
                    $scope.pesananBarang.editable = true;
                    break;
                default:
                    $scope.pesananBarang.editable = false;
            }
            angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang) {
                switch (itemBarang.status) {
                    case "NEW":
                        itemBarang.editable = true;
                        break;
                    default:
                        itemBarang.editable = false;
                }
            });
        });
    };
    $scope.new = function() {
        $scope.pesananBarang = new pesananBarangFactory({
            nomor: "SP" + new Date().getTime(),
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            ppn: false,
            diskon: 0,
            kurs: 1,
            valuta: "IDR",
            valutaBayar: "IDR",
            status: "NEW",
            syaratBayar: 0,
            spItemsList: [],
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
        }
        warning = warning + "Data Pesanan Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            var fieldName = field.name.split('.');
            if (field.warning) {
                switch (fieldName.length) {
                    case 1:
                        if (!!$scope.pesananBarang[field.name]) {
                            warning = warning + field.header + " : " + $scope.pesananBarang[field.name] + "\n";
                        }
                        break;
                    case 2:
                        if (!!$scope.pesananBarang[fieldName[0]][fieldName[1]]) {
                            warning = warning + field.header + " : " + $scope.pesananBarang[fieldName[0]][fieldName[1]] + "\n";
                        }
                        break;
                }
            }
        });
        warning = warning + "Item Barang : \n";
        angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang, i) {
            warning = warning + "     " + (i + 1) + ". " + itemBarang.barang.nama + " " + itemBarang.jumlah + " " + itemBarang.barang.satuan + "\n";
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.pesananBarang.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Pesanan Barang Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.pesananBarang.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Pesanan Barang Telah Diubah...");
            });
        }
    };
    $scope.delete = function(pesananBarang) {
        $scope.pesananBarang = pesananBarang;
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            pesananBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Pesanan Barang Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.approveAllItem = function(pesananBarang) {
        $scope.pesananBarang = pesananBarang;
        var confirm = $window.confirm($scope.warning("approve"));
        if (confirm) {
            $scope.pesananBarang.status = "APPROVED";
            angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang) {
                if (itemBarang.editable) {
                    itemBarang.status = "APPROVED";
                }
            });
            pesananBarang.$update(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Semua Item Permintaan Barang Telah Disetujui...");
                $scope.query();
            });
        }
    };
    $scope.rejectAllItem = function(pesananBarang) {
        $scope.pesananBarang = pesananBarang;
        var confirm = $window.confirm($scope.warning("reject"));
        if (confirm) {
            $scope.pesananBarang.status = "REJECTED";
            angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang) {
                if (itemBarang.editable) {
                    itemBarang.status = "REJECTED";
                }
            });
            $scope.pesananBarang.$update(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Semua Item Permintaan Barang Telah Ditolak...");
                $scope.query();
            });
        }
    };
    $scope.approveItem = function(pesananBarang, itemBarangToApprove) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            pesananBarang.status = "APPROVED";
            angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang) {
                if (itemBarang === itemBarangToApprove) {
                    itemBarang.status = "APPROVED";
                }
            });
            pesananBarang.$update(function() {
                toastr.success("Item Permintaan Barang Telah Disetujui...");
                $scope.query();
                $scope.get(pesananBarang.nomor);
            });
        }
    };
    $scope.rejectItem = function(pesananBarang, itemBarangToReject) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        var allRejected = 0;
        if (confirm) {
            angular.forEach(pesananBarang.spItemsList, function(itemBarang) {
                if (itemBarang.status == "REJECTED") {
                    allRejected++;
                }
                if (itemBarang === itemBarangToReject) {
                    itemBarang.status = "REJECTED";
                    allRejected++;
                }
                if (allRejected == pesananBarang.spItemsList.length) {
                    pesananBarang.status = "REJECTED";
                }
            });
            pesananBarang.$update(function() {
                toastr.success("Item Permintaan Barang Telah Ditolak...");
                $scope.query();
                $scope.get(pesananBarang.nomor);
            });
        }
    };
    $scope.getRate = function() {
        var url = "http://jsonrates.com/get/?from=" + $scope.pesananBarang.valuta + "&to=" + $scope.pesananBarang.valutaBayar + "&apiKey=jr-e24ec7990c9beb15f956913c940f1ed9&callback=JSON_CALLBACK";
        $http.jsonp(url).success(function(response) {
            $scope.pesananBarang.kurs = Number(response.rate);
        });
    };
    $scope.getBarangs = function(nomorSpp) {
        var barangs = [];
        angular.forEach($scope.permintaanBarangs, function(permintaanBarang) {
            if (nomorSpp == permintaanBarang.nomor) {
                angular.forEach(permintaanBarang.sppItemsList, function(itemBarang) {
                    if (itemBarang.status == "APPROVED") {
                        barangs.push(itemBarang.barang);
                    }
                });
            }
        });
        return barangs;
    };
    $scope.getItemBarang = function(index, nomorSpp, kodeBarang) {
        angular.forEach($scope.permintaanBarangs, function(permintaanBarang) {
            if (nomorSpp == permintaanBarang.nomor) {
                angular.forEach(permintaanBarang.sppItemsList, function(itemBarang) {
                    if (kodeBarang == itemBarang.barang.kode) {
                        $scope.pesananBarang.spItemsList[index].harga = itemBarang.harga;
                        $scope.pesananBarang.spItemsList[index].hargaKatalog = itemBarang.harga;
                        $scope.pesananBarang.spItemsList[index].satuan = itemBarang.satuan;
                        $scope.pesananBarang.spItemsList[index].jumlah = itemBarang.jumlah;
                    }
                });
            }
        });
    };
    $scope.getTotalCost = function() {
        var getTotalCost = 0;
        angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang) {
            getTotalCost = getTotalCost + (((itemBarang.harga * $scope.pesananBarang.kurs) - (itemBarang.harga * $scope.pesananBarang.kurs * $scope.pesananBarang.diskon / 100)) * itemBarang.jumlah);
        });
        return getTotalCost;
    };
    $scope.addDetail = function() {
        $scope.pesananBarang.spItemsList.push({
            jumlah: 0,
            harga: 0,
            hargaKatalog: 0,
            status: "NEW",
            editable: true
        });
    };
    $scope.removeDetail = function(index) {
        $scope.pesananBarang.spItemsList.splice(index, 1);
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.addDetail();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(pesananBarang) {
        $scope.newForm = false;
        $scope.get(pesananBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/detail-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(pesananBarang);
            }
        });
    };
    $scope.openUpdate = function(pesananBarang) {
        $scope.newForm = false;
        $scope.get(pesananBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.$watch("pesananBarang.kategori", function(newKategori, oldKategori) {
        if ((!!oldKategori && !!newKategori) && (oldKategori != newKategori)) {
            $scope.pesananBarang.supplier = "";
            $scope.pesananBarang.spItemsList = [];
            $scope.addDetail();
        }
    });
});
