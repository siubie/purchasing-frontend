angular.module("barang.controllers", []).controller("barangController", function($scope, $window, $modal, barangFactory, kategoriBarangFactory, satuanGudangFactory) {
    $scope.module = "barang";
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
    $scope.sort = {
        "field": "kode",
        "order": false
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.barangs = barangFactory.query(function() {
            angular.forEach($scope.barangs, function(barang) {
                barang.editable = true;
            });
        });
        $scope.items = $scope.barangs;
    };
    $scope.query();
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
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            barang.$delete(function() {
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
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "md",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(barang) {
        angular.copy(barang, $scope.barang);
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
        $scope.newForm = false;
        angular.copy(barang, $scope.barang);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/barang/views/form-barang.views.html",
            size: "md",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
});