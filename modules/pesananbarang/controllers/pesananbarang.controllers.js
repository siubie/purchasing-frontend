angular.module('pesananBarang.controllers', []).controller('pesananBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'supplierFactory', 'permintaanBarangFactory', 'pesananBarangFactory', function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, pesananBarangFactory) {
    $scope.module = "pesananBarang";
    $scope.fields = [{
        "name": "nomor",
        "header": "Nomor",
        "type": "string"
    }, {
        "name": "tanggal",
        "header": "Tanggal",
        "type": "date",
        "filter": "longDate"
    }, {
        "name": "supplier.nama",
        "header": "Supplier",
        "type": "string"
    }, {
        "name": "ppn",
        "header": "PPN",
        "type": "ppn"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "nomor",
        "order": true
    };
    $scope.newForm = true;
    $scope.load = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.pesananBarangs = pesananBarangFactory.query();
        $scope.items = $scope.pesananBarangs;
    };
    $scope.load();
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
            spItemsList: []
        });
        if (!!localStorage.permintaanBarangCart) {
            $scope.permintaanBarangCart = JSON.parse(localStorage.permintaanBarangCart);
            angular.forEach($scope.permintaanBarangCart, function(itemBarang) {
                $scope.pesananBarang.spItemsList.push({
                    spp: itemBarang.spp,
                    barang: itemBarang.barang,
                    qty: itemBarang.qty,
                    harga: itemBarang.harga,
                    status: "RECEIVED"
                });
            });
        }
    };
    $scope.new();
    $scope.create = function() {
        console.log("pesananBarang : ", JSON.stringify($scope.pesananBarang));
        $scope.pesananBarang.$save(function() {
            $scope.close();
        });
    };
    $scope.update = function() {
        console.log("pesananBarang : ", JSON.stringify($scope.pesananBarang));
        $scope.pesananBarang.$update(function() {
            $scope.close();
        });
    };
    $scope.delete = function(pesananBarang) {
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            pesananBarang.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.openRead = function(pesananBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.pesananBarang = angular.copy(pesananBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/detail-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(permintaanBarang);
            }
        });
    };
    $scope.openUpdate = function(pesananBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.pesananBarang = angular.copy(pesananBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openCreatePenerimaanBarang = function(pesananBarang) {
        $scope.close();
        $scope.newForm = true;
        localStorage.setItem("pesananBarang", JSON.stringify(pesananBarang));
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/penerimaanbarang/views/form-penerimaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: "penerimaanBarangController",
            scope: $scope
        });
    };
    $scope.removeDetail = function(index) {
        $scope.pesananBarang.spItemsList.splice(index, 1);
    };
}]);