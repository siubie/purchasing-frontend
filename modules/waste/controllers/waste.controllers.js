angular.module("waste.controllers", []).controller("wasteController", function($scope, $window, $modal, wasteFactory) {
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
            $scope.items = $scope.wastes;
        };
        $scope.load();
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
            var modalInstance = $modal.open({
                templateUrl: "modules/waste/views/form-waste.views.html",
                size: "lg",
                backdrop: "static",
                controller: "createwasteController"
            });
            modalInstance.result.then(function() {
                $scope.load();
            });
        };
        $scope.openRead = function(waste) {
            $scope.close();
            $scope.waste = waste;
            var modalInstance = $modal.open({
                templateUrl: "modules/waste/views/detail-waste.views.html",
                size: "lg",
                backdrop: "static",
                scope: $scope
            });
            modalInstance.result.then({}, function(reason) {
                if (reason == "update") {
                    $scope.openUpdate(waste);
                }
            });
        };
        $scope.openUpdate = function(waste) {
            $scope.close();
            var modalInstance = $modal.open({
                templateUrl: "modules/waste/views/form-waste.views.html",
                size: "lg",
                backdrop: "static",
                controller: "updatewasteController",
                resolve: {
                    waste: function() {
                        return waste;
                    }
                }
            });
            modalInstance.result.then(function() {
                $scope.load();
            });
        };
    })
    .controller("createwasteController", function($scope, satuanGudangFactory, wasteFactory) {
        $scope.newForm = true;
        $scope.waste = new wasteFactory();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.create = function() {
            $scope.waste.$save(function() {
                $scope.$close();
            });
        };
    })
    .controller("updatewasteController", function($scope, satuanGudangFactory, wasteFactory, waste) {
        $scope.waste = waste;
        $scope.newForm = false;
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.update = function() {
            $scope.waste.$update(function() {
                $scope.$close();
            });
        };
    });