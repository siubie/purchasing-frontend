angular.module("penjualanWaste.controllers", []).controller("penjualanWasteController", function($scope, $window, $modal, $filter, wasteFactory, penjualanWasteFactory) {
    $scope.module = "penjualanWaste";
    $scope.access = {
        create: true,
        update: true,
        delete: true,
        expand: false,
        selection: false,
        cart: false
    };
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
    $scope.sort = {
        "field": "nomor",
        "order": true
    };
    $scope.query = function() {
        $scope.wastes = wasteFactory.query();
        $scope.penjualanWastes = penjualanWasteFactory.query(function() {
            angular.forEach($scope.penjualanWastes, function(penjualanWaste) {
                penjualanWaste.editable = true;
            });
        });
        $scope.items = $scope.penjualanWastes;
    };
    $scope.query();
    $scope.new = function() {
        $scope.penjualanWaste = new penjualanWasteFactory({
            nomor: "PW" + new Date().getTime(),
            tanggal: $filter('date')(new Date(), 'yyyy-MM-dd'),
            wasteItemsList: []
        });
        if ($scope.cartSystem && !!localStorage.wasteCart) {
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
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("penjualanWaste : ", JSON.stringify($scope.penjualanWaste));
        $scope.penjualanWaste.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(penjualanWaste) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            penjualanWaste.$delete(function() {
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
        $scope.addDetail();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(penjualanWaste) {
        angular.copy(penjualanWaste, $scope.penjualanWaste);
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
        $scope.newForm = false;
        angular.copy(penjualanWaste, $scope.penjualanWaste);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.addDetail = function(index) {
        $scope.penjualanWaste.wasteItemsList.push({
            jumlah: 1
        });
    };
    $scope.removeDetail = function(index) {
        $scope.penjualanWaste.wasteItemsList.splice(index, 1);
    };
});