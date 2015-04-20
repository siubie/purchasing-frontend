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
    $scope.cartFields = [{
        "name": "kode",
        "type": "string",
        "header": "Kode Waste"
    }, {
        "name": "nama",
        "type": "string",
        "header": "Nama Waste"
    }, {
        "name": "satuan",
        "type": "String",
        "header": "Satuan",
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
    if (!!localStorage.wasteCart) {
        $scope.cart = JSON.parse(localStorage.wasteCart);
    }
    $scope.new = function() {
        $scope.waste = new wasteFactory({
            kode: "WST" + new Date().getTime(),
        });
    };
    $scope.create = function() {
        console.log("waste : ", JSON.stringify($scope.waste));
        $scope.waste.$save(function() {
            $scope.load();
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("waste : ", JSON.stringify($scope.waste));
        $scope.waste.$update(function() {
            $scope.load();
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(waste) {
        var confirmDelete = $window.confirm("Apakah Anda Yakin?");
        if (confirmDelete) {
            waste.$delete(function() {
                $scope.load();
                $scope.modalInstance.close();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.modalInstance.close();
        $scope.newForm = true;
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
        $scope.modalInstance.close();
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
        $scope.modalInstance.close();
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
        $scope.modalInstance.close();
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