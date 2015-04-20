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
    }, {
        "name": "status",
        "header": "Status",
        "type": "string"
    }];
    $scope.cartFields = [{
        "name": "spp",
        "type": "string",
        "header": "Nomor SPP"
    }, {
        "name": "barang.kode",
        "type": "string",
        "header": "Kode Barang"
    }, {
        "name": "barang.nama",
        "type": "string",
        "header": "Nama Barang"
    }, {
        "name": "qty",
        "type": "String",
        "header": "Jumlah SPP",
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "nomor",
        "order": true
    };
    $scope.timestamp = {
        "periode": new Date()
    };
    $scope.opened = {
        "periode": false,
        "tanggalButuh": []
    };
    $scope.load = function() {
        $scope.barangs = barangFactory.query();
        $scope.departemens = departemenFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.items = $scope.permintaanBarangs;
    };
    $scope.load();
    if (!!localStorage.permintaanBarangCart) {
        $scope.cart = JSON.parse(localStorage.permintaanBarangCart);
    }
    $scope.new = function() {
        $scope.permintaanBarang = new permintaanBarangFactory({
            nomor: "SPP" + new Date().getTime(),
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            jenis: false,
            periode: $filter('date')($scope.timestamp.periode, 'MM-yyyy'),
            status: "RECEIVED",
            sppItemsList: []
        });
        if (!!localStorage.katalogBarangCart) {
            $scope.katalogBarangCart = JSON.parse(localStorage.katalogBarangCart);
            angular.forEach($scope.katalogBarangCart, function(itemBarang) {
                $scope.permintaanBarang.sppItemsList.push({
                    barang: itemBarang.barang,
                    tanggalButuh: $filter('date')((new Date() + itemBarang.leadTime), 'yyyy-MM-dd'),
                    jumlah: 1,
                    status: "RECEIVED",
                    harga: itemBarang.harga
                });
            });
        }
    };
    $scope.new();
    $scope.create = function() {
        console.log("permintaanBarang : ", JSON.stringify($scope.permintaanBarang));
        $scope.permintaanBarang.$save(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("permintaanBarang : ", JSON.stringify($scope.permintaanBarang));
        $scope.permintaanBarang.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(permintaanBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            permintaanBarang.$delete(function() {
                $scope.modalInstance.close();
            });
        }
    };
    $scope.approve = function(permintaanBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            permintaanBarang.status = "APPROVED";
            console.log("permintaanBarang : ", JSON.stringify($scope.permintaanBarang));
            permintaanBarang.$update(function() {
                $scope.load();
                $scope.modalInstance.close();
            });
        }
    };
    $scope.reject = function(permintaanBarang) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            permintaanBarang.status = "REJECTED";
            console.log("permintaanBarang : ", JSON.stringify($scope.permintaanBarang));
            permintaanBarang.$update(function() {
                $scope.load();
                $scope.modalInstance.close();
            });
        }
    };
    $scope.openRead = function(permintaanBarang) {
        $scope.modalInstance.close();
        $scope.newForm = false;
        $scope.permintaanBarang = permintaanBarang;
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanbarang/views/detail-permintaanbarang.views.html',
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
    $scope.openUpdate = function(permintaanBarang) {
        $scope.modalInstance.close();
        $scope.newForm = false;
        $scope.permintaanBarang = permintaanBarang;
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanbarang/views/form-permintaanbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
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
        $scope.modalInstance.close();
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/pesananbarang/views/form-pesananbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: 'pesananBarangController',
            scope: $scope
        });
        $scope.modalInstance.close();
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