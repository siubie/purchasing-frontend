angular.module("penjualanWaste.controllers", []).controller("penjualanWasteController", function($scope, $window, $modal, penjualanWasteFactory) {
        $scope.module = "penjualanWaste";
        $scope.fields = [{
            "name": "nomor",
            "type": "string",
            "header": "Nomor"
        }, {
            "name": "tanggal",
            "type": "date",
            "header": "Tanggal"
        }, {
            "name": "nama",
            "type": "string",
            "header": "Nama"
        }, {
            "name": "alamat",
            "type": "string",
            "header": "Alamat"
        }];
        $scope.Math = window.Math;
        $scope.sort = {
            "field": "nomor",
            "order": false
        };
        $scope.load = function() {
            $scope.penjualanWastes = penjualanWasteFactory.query();
            $scope.items = $scope.penjualanWastes;
        };
        $scope.load();
        $scope.delete = function(penjualanWaste) {
            var confirmDelete = $window.confirm("Apakah Anda Yakin?");
            if (confirmDelete) {
                penjualanWaste.$delete(function() {
                    $scope.load();
                    $scope.close();
                });
            }
        };
        $scope.openCreate = function() {
            $scope.close();
            var modalInstance = $modal.open({
                templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
                size: "lg",
                backdrop: "static",
                controller: "createPenjualanWasteController"
            });
            modalInstance.result.then(function() {
                $scope.load();
            });
        };
        $scope.openRead = function(penjualanWaste) {
            $scope.close();
            $scope.penjualanWaste = penjualanWaste;
            var modalInstance = $modal.open({
                templateUrl: "modules/penjualanwaste/views/detail-penjualanwaste.views.html",
                size: "lg",
                backdrop: "static",
                scope: $scope
            });
            modalInstance.result.then({}, function(reason) {
                if (reason == "update") {
                    $scope.openUpdate(penjualanWaste);
                }
            });
        };
        $scope.openUpdate = function(penjualanWaste) {
            $scope.close();
            var modalInstance = $modal.open({
                templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
                size: "lg",
                backdrop: "static",
                controller: "updatePenjualanWasteController",
                resolve: {
                    penjualanWaste: function() {
                        return penjualanWaste;
                    }
                }
            });
            modalInstance.result.then(function() {
                $scope.load();
            });
        };
    })
    .controller("createPenjualanWasteController", function($scope, $filter, satuanGudangFactory, penjualanWasteFactory) {
        $scope.newForm = true;
        $scope.penjualanWaste = new penjualanWasteFactory({
            tanggal: $filter("date")(new Date(), "yyyy-MM-dd"),
            wasteItemsList: []
        });
        $scope.penjualanWaste.wasteItemsList.push({
            jumlah: 1
        });
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.create = function() {
            $scope.penjualanWaste.$save(function() {
                $scope.$close();
            });
        };
        $scope.addDetail = function() {
            $scope.penjualanWaste.wasteItemsList.push({
                jumlah: 1
            });
        };
        $scope.removeDetail = function(index) {
            $scope.penjualanWaste.wasteItemsList.splice(index, 1);
        };
    })
    .controller("updatePenjualanWasteController", function($scope, satuanGudangFactory, penjualanWasteFactory, penjualanWaste) {
        $scope.penjualanWaste = penjualanWaste;
        $scope.newForm = false;
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.update = function() {
            $scope.penjualanWaste.$update(function() {
                $scope.$close();
            });
        };
        $scope.addDetail = function() {
            $scope.penjualanWaste.wasteItemsList.push({
                jumlah: 1
            });
        };
        $scope.removeDetail = function(index) {
            $scope.penjualanWaste.wasteItemsList.splice(index, 1);
        };
    });