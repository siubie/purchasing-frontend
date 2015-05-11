angular.module('supplier.controllers', []).controller("supplierController", function($scope, $window, $state, $modal, $filter, kategoriBarangFactory, supplierFactory) {
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
    }, {
        "name": "kategori",
        "type": "array",
        "header": "Kategori"
    }];
    $scope.sort = {
        "field": "kode",
        "order": false
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.suppliers = supplierFactory.query(function() {
            angular.forEach($scope.suppliers, function(supplier) {
                supplier.editable = true;
            });
        });
        $scope.items = $scope.suppliers;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.supplier = supplierFactory.get({
            id: id
        }, function() {
            $scope.supplier.editable = true;
        });
    };
    $scope.new = function() {
        $scope.supplier = new supplierFactory({
            kode: "SUP" + new Date().getTime(),
            editable: true
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
                $scope.query();
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
            $scope.query();
        });
    };
    $scope.openRead = function(supplier) {
        $scope.get(supplier.kode);
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
        $scope.get(supplier.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/supplier/views/form-supplier.views.html',
            size: 'md',
            backdrop: 'static',
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
});