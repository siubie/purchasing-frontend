angular.module("waste.controllers", []).controller("wasteController", function($scope, $window, $modal, wasteFactory, satuanGudangFactory) {
    $scope.module = "waste";
    $scope.fields = [{
        "name": "kode",
        "type": "string",
        "header": "Kode"
    }, {
        "name": "nama",
        "type": "string",
        "header": "Nama"
    }, {
        "name": "satuan",
        "type": "string",
        "header": "Satuan"
    }];
    $scope.Math = window.Math;
    $scope.sort = {
        "field": "kode",
        "order": false
    };
    $scope.load = function() {
        $scope.wastes = wasteFactory.query();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.items = $scope.wastes;
    };
    $scope.load();
    $scope.create = function() {
        console.log("waste : ", JSON.stringify($scope.waste));
        $scope.waste.$save(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.update = function() {
        console.log("waste : ", JSON.stringify($scope.waste));
        $scope.waste.$update(function() {
            $scope.load();
            $scope.close();
        });
    };
    $scope.delete = function(waste) {
        var confirmDelete = $window.confirm("Apakah Anda Yakin?");
        if (confirmDelete) {
            waste.$delete(function() {
                $scope.load();
                $scope.close();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.close();
        $scope.newForm = true;
        $scope.waste = new wasteFactory();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/form-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openRead = function(waste) {
        $scope.close();
        $scope.waste = waste;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/detail-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(waste);
            }
        });
    };
    $scope.openUpdate = function(waste) {
        $scope.close();
        $scope.waste = waste;
        $scope.newForm = false;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/form-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope,
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openCreatePenjualanWaste = function() {
        $scope.close();
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            controller: "penjualanWasteController",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
});