angular.module("penjualanWaste.controllers", []).controller("penjualanWasteController", function($scope, $window, $modal, $filter, penjualanWasteFactory) {
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
    $scope.new = function() {
        $scope.penjualanWaste = new penjualanWasteFactory({
            nomor: "PW" + new Date().getTime(),
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            wasteItemsList: []
        });
        if (!!localStorage.wasteCart) {
            $scope.wasteCart = JSON.parse(localStorage.wasteCart);
            angular.forEach($scope.wasteCart, function(itemWasteCart) {
                $scope.penjualanWaste.wasteItemsList.push({
                    waste: itemWasteCart,
                    jumlah: 1
                });
            });
        }
    };
    $scope.new();
    $scope.create = function() {
        console.log("penjualanWaste : ", JSON.stringify($scope.penjualanWaste));
        $scope.penjualanWaste.$save(function() {
            $scope.close();
        });
    };
    $scope.update = function() {
        console.log("penjualanWaste : ", JSON.stringify($scope.penjualanWaste));
        $scope.penjualanWaste.$update(function() {
            $scope.close();
        });
    };
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
        $scope.newForm = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openRead = function(penjualanWaste) {
        $scope.close();
        $scope.penjualanWaste = penjualanWaste;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/detail-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(penjualanWaste);
            }
        });
    };
    $scope.openUpdate = function(penjualanWaste) {
        $scope.close();
        $scope.newForm = false;
        $scope.penjualanWaste = penjualanWaste;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.removeDetail = function(index) {
        $scope.penjualanWaste.wasteItemsList.splice(index, 1);
    };
});