angular.module("waste.controllers", []).controller("wasteController", function($scope, $window, $modal, wasteFactory, satuanGudangFactory) {
    $scope.module = "waste";
    $scope.access = {
        create: true,
        update: true,
        delete: true,
        expand: false,
        selection: true,
        cart: true
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
    $scope.sort = {
        "field": "kode",
        "order": false
    };
    $scope.query = function() {
        $scope.wastes = wasteFactory.query(function() {
            angular.forEach($scope.wastes, function(waste) {
                waste.editable = true;
            });
        });
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.items = $scope.wastes;
    };
    $scope.query();
    if (!!localStorage.wasteCart) {
        $scope.cart = JSON.parse(localStorage.wasteCart);
    }
    $scope.new = function() {
        $scope.waste = new wasteFactory({
            kode: "WST" + new Date().getTime(),
        });
        console.log("new waste");
    };
    $scope.new();
    $scope.create = function() {
        console.log("waste : ", JSON.stringify($scope.waste));
        $scope.waste.$save(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("waste : ", JSON.stringify($scope.waste));
        $scope.waste.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(waste) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            waste.$delete(function() {
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
            templateUrl: "modules/waste/views/form-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(waste) {
        angular.copy(waste, $scope.waste);
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
        angular.copy(waste, $scope.waste);
        $scope.newForm = false;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/form-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope,
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openCreatePenjualanWaste = function() {
        $scope.newForm = true;
        $scope.cartSystem = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            controller: "penjualanWasteController",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.uncheckAll();
        });
    };
});