angular.module('permintaanBarang.controllers', []).controller('permintaanBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'barangFactory', 'departemenFactory', 'permintaanBarangFactory', function($scope, $window, $state, $modal, $filter, barangFactory, departemenFactory, permintaanBarangFactory) {
    $scope.module = "permintaanBarang";
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
        "name": "jenis",
        "header": "Jenis",
        "type": "jenis"
    }, {
        "name": "departemen.departemen",
        "header": "Peminta",
        "type": "string"
    }, {
        "name": "periode",
        "header": "Periode",
        "type": "periode"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "tanggal",
        "order": true
    };
    $scope.timestamp = {
        "periode": new Date()
    };
    $scope.opened = {
        "periode": false,
        "tanggalButuh": []
    };
    $scope.new = function() {
        $scope.permintaanBarang = new permintaanBarangFactory({
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            jenis: false,
            periode: $filter('date')($scope.timestamp.periode, 'MM-yyyy'),
            status: "RECEIVED",
            sppItemsList: []
        });
        if (!!localStorage.barangCart) {
            $scope.barangCart = JSON.parse(localStorage.barangCart);
            angular.forEach($scope.barangCart, function(itemBarangCart) {
                $scope.permintaanBarang.sppItemsList.push({
                    barang: itemBarangCart,
                    tanggalButuh: $filter('date')(new Date(), 'yyyy-MM-dd'),
                    jumlah: 1,
                    status: "RECEIVED"
                });
            });
        }
    };
    $scope.new();
    $scope.load = function() {
        $scope.barangs = barangFactory.query();
        $scope.departemens = departemenFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.items = $scope.permintaanBarangs;
    };
    $scope.load();
    $scope.create = function() {
        $scope.permintaanBarang.$save(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.update = function() {
        $scope.permintaanBarang.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(permintaanBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            permintaanBarang.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.approve = function(permintaanBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            permintaanBarang.status = "APPROVED";
            permintaanBarang.$update(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.reject = function(permintaanBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            permintaanBarang.status = "REJECTED";
            permintaanBarang.$update(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.openRead = function(permintaanBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.permintaanBarang = angular.copy(permintaanBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanbarang/views/detail-permintaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(permintaanBarang) {
        $scope.close();
        $scope.newForm = false;
        $scope.permintaanBarang = angular.copy(permintaanBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanbarang/views/form-permintaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
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
        $scope.close();
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: 'pesananBarangController',
            scope: $scope
        });
        $scope.close();
    };
    $scope.$watch('timestamp', function() {
        $scope.permintaanBarang.periode = $filter('date')($scope.timestamp.periode, 'MM-yyyy');
        if (($filter('date')($scope.timestamp.periode, 'yyyyMMdd')) < ($filter('date')(new Date(), 'yyyyMMdd'))) {
            $scope.timestamp.periode = new Date();
        }
        angular.forEach($scope.permintaanBarang.sppItemsList, function(detailBarang) {
            detailBarang.tanggalButuh = $filter('date')($scope.timestamp.periode, 'yyyy-MM-dd');
        });
    }, true);
    $scope.$watchCollection('permintaanBarang.sppItemsList', function() {
        angular.forEach($scope.permintaanBarang.sppItemsList, function(detailBarang) {
            detailBarang.tanggalButuh = $filter('date')(detailBarang.tanggalButuh, 'yyyy-MM-dd');
        });
    }, true);
}]);