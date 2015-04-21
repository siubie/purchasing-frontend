angular.module('supplier.controllers', []).controller('supplierController', ['$scope', '$window', '$state', '$modal', '$filter', 'supplierFactory', function($scope, $window, $state, $modal, $filter, supplierFactory) {
    $scope.module = "supplier";
    $scope.access = {
        create: true,
        update: true,
        delete: true,
        expand: false,
        selection: false,
        cart: false
    };
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
    $scope.sort = {
        "field": "kode",
        "order": false
    };
    $scope.load = function() {
        $scope.suppliers = supplierFactory.query();
        $scope.items = $scope.suppliers;
    };
    $scope.load();
    $scope.new = function() {
        $scope.supplier = new supplierFactory({
            kode: "SUP" + new Date().getTime()
        });
    };
    $scope.new();
    $scope.create = function() {
        console.log("supplier : ", JSON.stringify($scope.supplier));
        $scope.supplier.$save(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("supplier : ", JSON.stringify($scope.supplier));
        $scope.supplier.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(supplier) {
        var confirm = $window.confirm('Apakah Anda Yakin?');
        if (confirm) {
            supplier.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                $scope.load();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/form-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openRead = function(supplier) {
        angular.copy(supplier,$scope.supplier);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/detail-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(supplier);
            }
        });
    };
    $scope.openUpdate = function(supplier) {
        $scope.newForm = false;
        angular.copy(supplier,$scope.supplier);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/form-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
}]);