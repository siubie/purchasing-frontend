angular.module('pesananBarang.controllers', []).controller('pesananBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'supplierFactory', 'permintaanBarangFactory', 'pesananBarangFactory', function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, pesananBarangFactory) {
    $scope.module = "pesananBarang";
    $scope.access = {
        create: false,
        update: true,
        delete: true,
        expand: false,
        selection: false,
        cart: false
    };
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
    }, {
        "name": "status",
        "header": "Status",
        "type": "string"
    }];
    $scope.sort = {
        "field": "nomor",
        "order": true
    };
    $scope.newForm = true;
    $scope.query = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.pesananBarangs = pesananBarangFactory.query(function() {
            angular.forEach($scope.pesananBarangs, function(pesananBarang) {
                pesananBarang.editable = true;
            });
        });
        $scope.items = $scope.pesananBarangs;
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
            spItemsList: []
        });
        if ($scope.cartSystem && !!localStorage.permintaanBarangCart) {
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
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("pesananBarang : ", JSON.stringify($scope.pesananBarang));
        $scope.pesananBarang.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(pesananBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            pesananBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                $scope.query();
            });
        }
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
    $scope.removeDetail = function(index) {
        $scope.pesananBarang.spItemsList.splice(index, 1);
    };
}]);