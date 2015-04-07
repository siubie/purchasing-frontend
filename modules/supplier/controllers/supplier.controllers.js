angular.module('supplier.controllers', []).controller('supplierController', ['$scope', '$window', '$state', '$modal', '$filter', 'supplierFactory', function($scope, $window, $state, $modal, $filter, supplierFactory) {
    $scope.module = "supplier";
    $scope.fields = [{
        "name": "kode",
        "type": "string",
        "header": "Kode"
    }, {
        "name": "nama",
        "type": "string",
        "header": "Nama"
    }, {
        "name": "alamat",
        "type": "string",
        "header": "Alamat"
    }, {
        "name": "nomorTelepon",
        "type": "string",
        "header": "Telepon"
    }];
    $scope.Math = window.Math;
    $scope.sort = "kode";
    $scope.reverse = false;
    $scope.telepon = {};
    $scope.new = function() {
        $scope.supplier = new supplierFactory();
    };
    $scope.load = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.items = $scope.suppliers;
        $scope.new();
    };
    $scope.create = function() {
        console.log("supplier : ", JSON.stringify($scope.supplier));
        $scope.supplier.$save(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.update = function() {
        console.log("supplier : ", JSON.stringify($scope.supplier));
        $scope.supplier.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(supplier) {
        var confirmDelete = $window.confirm('Apakah Anda Yakin?');
        if (confirmDelete) {
            supplier.$delete(function() {
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
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/form-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openRead = function(supplier) {
        $scope.close();
        $scope.supplier = angular.copy(supplier);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/detail-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
    };
    $scope.openUpdate = function(supplier) {
        $scope.close();
        $scope.newForm = false;
        $scope.supplierOld = angular.copy(supplier);
        $scope.supplier = angular.copy(supplier);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/form-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
    };
}]);