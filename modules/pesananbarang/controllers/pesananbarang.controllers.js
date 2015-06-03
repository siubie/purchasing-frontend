angular.module('pesananBarang.controllers', []).controller('pesananBarangController', function($scope, $window, $state, $modal, $filter, $http, kategoriBarangFactory, supplierFactory, permintaanBarangFactory, pesananBarangFactory) {
    $scope.module = "pesananBarang";
    $scope.access = {
        create: true,
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
                pesananBarang.editable = true;
            });
        });
        $scope.items = $scope.pesananBarangs;
        // $http.jsonp("http://jsonrates.com/get/?base=IDR&apiKey=jr-e24ec7990c9beb15f956913c940f1ed9&callback=JSON_CALLBACK").success(function(response) {
        //     $scope.kurs = response.rates;
        // });
        $scope.sppItemsList = [];
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.pesananBarang = pesananBarangFactory.get({
            id: id
        }, function() {
            $scope.pesananBarang.editable = true;
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
            status: "RECEIVED",
            syaratBayar: 0,
            spItemsList: [],
            editable: true
        });
        if ($scope.cartSystem && !!localStorage.permintaanBarangCart) {
            $scope.permintaanBarang = JSON.parse(localStorage.permintaanBarang);
            $scope.pesananBarang.kategori = $scope.permintaanBarang.kategori;
            $scope.permintaanBarangCart = JSON.parse(localStorage.permintaanBarangCart);
            angular.forEach($scope.permintaanBarangCart, function(itemBarang) {
                $scope.pesananBarang.spItemsList.push({
                    spp: itemBarang.spp,
                    barang: itemBarang.barang,
                    satuan: itemBarang.satuan,
                    jumlah: itemBarang.jumlah,
                    harga: itemBarang.harga,
                    hargaKatalog: itemBarang.hargaKatalog,
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
    $scope.getRate = function() {
        var url = "http://jsonrates.com/get/?from=" + $scope.pesananBarang.valuta + "&to=" + $scope.pesananBarang.valutaBayar + "&apiKey=jr-e24ec7990c9beb15f956913c940f1ed9&callback=JSON_CALLBACK";
        $http.jsonp(url).success(function(response) {
            $scope.pesananBarang.kurs = Number(response.rate);
        });
    };
    $scope.totalCost = function() {
        var totalCost = 0;
        angular.forEach($scope.pesananBarang.spItemsList, function(itemBarang) {
            totalCost = totalCost + (((itemBarang.harga * $scope.pesananBarang.kurs) - (itemBarang.harga * $scope.pesananBarang.kurs * $scope.pesananBarang.diskon / 100)) * itemBarang.jumlah);
        });
        return totalCost;
    };
    $scope.changeItemBarang = function (index, kodeBarang) {
        angular.forEach($scope.sppItemsList[index], function(itemBarang) {
            if (itemBarang.barang.kode == kodeBarang) {
                $scope.pesananBarang.spItemsList[index].hargaKatalog = itemBarang.harga;
                $scope.pesananBarang.spItemsList[index].satuan = itemBarang.satuan;
                $scope.pesananBarang.spItemsList[index].jumlah = itemBarang.jumlah;
            }
        });
    };
    $scope.addDetail = function() {
        $scope.pesananBarang.spItemsList.push({
            jumlah: 0,
            harga: 0,
            hargaKatalog: 0,
            status: "RECEIVED",
            editable: true
        });
    };
    $scope.removeDetail = function(index) {
        $scope.pesananBarang.spItemsList.splice(index, 1);
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.cartSystem = false;
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
    $scope.openCreatePenerimaanBarang = function(pesananBarang) {
        $scope.newForm = true;
        $scope.cartSystem = true;
        localStorage.setItem("pesananBarang", JSON.stringify(pesananBarang));
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/penerimaanbarang/views/form-penerimaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: "penerimaanBarangController",
            scope: $scope
        });
    };
    $scope.$watch("pesananBarang.kategori", function(newKategori, oldKategori) {
        if ((!!oldKategori && !!newKategori) && (oldKategori != newKategori)) {
            $scope.pesananBarang.spItemsList = [];
            $scope.addDetail();
        }
    });
});
