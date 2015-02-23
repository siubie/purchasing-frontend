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
    $scope.status = true;
    $scope.new = function() {
        $scope.pesananBarang = new pesananBarangFactory({
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            ppn: false,
            spItemsList: []
        });
        // if (!!localStorage.permintaanBarangCart) {
        //     $scope.barangCart = JSON.parse(localStorage.barangCart);
        //     angular.forEach($scope.barangCart, function(itemBarangCart) {
        //         $scope.pesananBarang.sppItemsList.push({
        //             barang: itemBarangCart,
        //             tanggalButuh: $filter('date')(new Date(), 'yyyy-MM-dd'),
        //             jumlah: 1,
        //             status: "RECEIVED"
        //         });
        //     });
        // }
    };
    $scope.new();
    $scope.load = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.pesananBarangs = pesananBarangFactory.query();
        $scope.items = $scope.pesananBarangs;
    };
    $scope.load();
    $scope.create = function() {
        $scope.pesananBarang.$save(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.update = function() {
        $scope.pesananBarang.$update(function() {
            $scope.load();
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
    $scope.openCreate = function() {
        $scope.close();
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openRead = function(pesananBarang) {
        $scope.close();
        $scope.pesananBarang = angular.copy(pesananBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/detail-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(pesananBarang) {
        $scope.close();
        $scope.status = false;
        $scope.pesananBarang = angular.copy(pesananBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.removeDetail = function(index) {
        $scope.pesananBarang.sppItemsList.splice(index, 1);
    };
}]);