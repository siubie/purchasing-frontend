angular.module("barang.controllers", []).controller("barangController", function($scope, $window, $modal, barangFactory, katalogBarangFactory) {
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
            $scope.barangs = barangFactory.query();
            $scope.items = $scope.barangs;
            $scope.katalogBarangs = katalogBarangFactory.query();
        };
        $scope.load();
        $scope.delete = function(barang) {
            var confirmDelete = $window.confirm("Apakah Anda Yakin?");
            if (confirmDelete) {
                barang.$delete(function() {
                    $scope.load();
                    $scope.close();
                });
            }
        };
        $scope.getKatalog = function(barang) {
            angular.forEach($scope.katalogBarangs, function(item) {
                console.log(barang);
                console.log(item);
                if (item.barang.kode == barang.kode) {
                    $scope.katalogBarangs = item;
                    console.log($scope.katalogBarangs);
                }
            });
        };
        $scope.openCreate = function() {
            $scope.close();
            var modalInstance = $modal.open({
                templateUrl: "modules/barang/views/form-barang.views.html",
                size: "md",
                backdrop: "static",
                controller: "createBarangController"
            });
            modalInstance.result.then(function() {
                $scope.load();
            });
        };
        $scope.openRead = function(barang) {
            $scope.close();
            $scope.barang = barang;
            var modalInstance = $modal.open({
                templateUrl: "modules/barang/views/detail-barang.views.html",
                size: "md",
                backdrop: "static",
                scope: $scope
            });
            modalInstance.result.then({}, function(reason) {
                if (reason == "update") {
                    $scope.openUpdate(barang);
                }
            });
        };
        $scope.openUpdate = function(barang) {
            $scope.close();
            var modalInstance = $modal.open({
                templateUrl: "modules/barang/views/form-barang.views.html",
                size: "md",
                backdrop: "static",
                controller: "updateBarangController",
                resolve: {
                    barang: function() {
                        return barang;
                    }
                }
            });
            modalInstance.result.then(function() {
                $scope.load();
            });
        };
        $scope.openCreatePermintaanBarang = function() {
            $scope.newForm = true;
            $scope.close();
            $scope.modalInstance = $modal.open({
                templateUrl: "modules/permintaanbarang/views/form-permintaanbarang.views.html",
                size: "lg",
                backdrop: "static",
                controller: "permintaanBarangController",
                scope: $scope
            });
            $scope.close();
        };
    })
    .controller("createBarangController", function($scope, satuanGudangFactory, kategoriBarangFactory, barangFactory) {
        $scope.newForm = true;
        $scope.barang = new barangFactory();
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.create = function() {
            $scope.barang.$save(function() {
                $scope.$close();
            });
        };
    })
    .controller("updateBarangController", function($scope, satuanGudangFactory, kategoriBarangFactory, barangFactory, barang) {
        $scope.barang = barang;
        $scope.newForm = false;
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.satuanGudangs = satuanGudangFactory.query();
        $scope.update = function() {
            $scope.barang.$update(function() {
                $scope.$close();
            });
        };
    });