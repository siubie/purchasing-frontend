angular.module('permintaanBarang.controllers', []).controller('permintaanBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'barangFactory', 'departemenFactory', 'permintaanBarangFactory', function($scope, $window, $state, $modal, $filter, barangFactory, departemenFactory, permintaanBarangFactory) {
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
    $scope.sort = "nomor";
    $scope.reverse = true;
    $scope.timestamp = new Object({
        tanggal: new Date(),
        periode: new Date(),
        tanggalButuh: []
    });
    $scope.new = function() {
        $scope.permintaanBarang = new permintaanBarangFactory({
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            jenis: false,
            periode: $filter('date')(new Date(), 'MM-yyyy'),
            sppItemsList: new Array({
                tanggalButuh: $filter('date')(new Date(), 'yyyy-MM-dd')
            })
        });
    };
    $scope.load = function() {
        $scope.barangs = barangFactory.query();
        $scope.departemens = departemenFactory.query();
        $scope.permintaanBarangs = permintaanBarangFactory.query();
        $scope.new();
        $scope.items = $scope.permintaanBarangs;
    };
    $scope.openedTanggalButuh = [];
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
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            permintaanBarang.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.close = function() {
        if ($scope.modalInstance) {
            $scope.modalInstance.dismiss();
        }
    };
    $scope.openCreate = function() {
        $scope.close();
        $scope.status = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanBarang/views/form-permintaanBarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openRead = function(permintaanBarang) {
        $scope.close();
        $scope.permintaanBarang = angular.copy(permintaanBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanBarang/views/detail-permintaanBarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(permintaanBarang) {
        $scope.close();
        $scope.status = false;
        // $scope.permintaanBarangOld = angular.copy(permintaanBarang);
        $scope.permintaanBarang = angular.copy(permintaanBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/permintaanBarang/views/form-permintaanBarang.views.html',
            size: 'lg',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.addDetail = function() {
        $scope.permintaanBarang.sppItemsList.push({
            tanggalButuh: $filter('date')(new Date(), 'yyyy-MM-dd')
        });
    };
    $scope.removeDetail = function(index) {
        $scope.permintaanBarang.sppItemsList.splice(index, 1);
    };
    $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedPeriode = true;
    };
    $scope.openTanggalButuh = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedTanggalButuh[index] = true;
    };
    $scope.$watch('timestamp.periode', function() {
        // console.log($scope.timestamp.periode);
        $scope.permintaanBarang.periode = $filter('date')($scope.timestamp.periode, 'MM-yyyy');
    });
    $scope.$watchCollection('timestamp.tanggalButuh', function() {
        angular.forEach($scope.timestamp.tanggalButuh, function(tanggalButuh, i) {
            // console.log($scope.timestamp.tanggalButuh[i]);
            $scope.permintaanBarang.sppItemsList[i].tanggalButuh = $filter('date')(tanggalButuh, 'yyyy-MM-dd');
        });
    });
}]);