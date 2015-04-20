angular.module("barang.controllers", []).controller("barangController", function($scope, $window, $modal, barangFactory, kategoriBarangFactory, satuanGudangFactory) {
    $scope.module = "barang";
    $scope.fields = [{
        "name": "kode",
        "type": "string",
        "header": "Kode"
    }, {
        "name": "kategori",
        "type": "string",
        "header": "kategori"
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
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.barangs = barangFactory.query();
        $scope.items = $scope.barangs;
    };
    $scope.load();
    $scope.new = function() {
        $scope.barang = new barangFactory({
            kode: "BRG" + new Date().getTime()
        });
    };
    $scope.new();
    $scope.create = function() {
        console.log("barang : ", JSON.stringify($scope.barang));
        $scope.barang.$save(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("barang : ", JSON.stringify($scope.barang));
        $scope.barang.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(barang) {
        var confirmDelete = $window.confirm("Apakah Anda Yakin?");
        if (confirmDelete) {
            barang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                } else {
                    $scope.load();
                }
            });
        }
    };
    $scope.openCreate = function() {
        $scope.modalInstance.close();
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "md",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
    $scope.openRead = function(barang) {
        $scope.modalInstance.close();
        $scope.barang = barang;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/detail-barang.views.html",
            size: "md",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(barang);
            }
        });
    };
    $scope.openUpdate = function(barang) {
        $scope.modalInstance.close();
        $scope.newForm = false;
        $scope.barang = barang;
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "md",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.load();
        });
    };
});