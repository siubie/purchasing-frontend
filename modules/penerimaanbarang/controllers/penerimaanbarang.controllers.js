angular.module("penerimaanBarang.controllers", [])
    .controller("penerimaanBarangController", function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, penerimaanBarangFactory) {
        $scope.module = "penerimaanBarang";
        $scope.fields = [{
            "name": "nomor",
            "header": "Nomor",
            "type": "string"
        }, {
            "name": "tanggalDatang",
            "header": "Tanggal Datang",
            "type": "date",
            "filter": "longDate"
        }, {
            "name": "tanggalBuat",
            "header": "Tanggal Dibuat",
            "type": "date",
            "filter": "longDate"
        }, {
            "name": "sp",
            "header": "Nomor SP",
            "type": "string"
        }, {
            "name": "supplier.nama",
            "header": "Supplier",
            "type": "string"
        }, {
            "name": "nomorSj",
            "header": "Nomor SJ",
            "type": "string"
        }];
        $scope.Math = window.Math;
        $scope.sort = {
            "field": "tanggal",
            "order": true
        };
        $scope.newForm = true;
        $scope.new = function() {
            $scope.penerimaanBarang = new penerimaanBarangFactory({
                tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
                lpbItemsList: []
            });
        };
        $scope.new();
        $scope.load = function() {
            $scope.penerimaanBarangs = penerimaanBarangFactory.query();
            $scope.items = $scope.penerimaanBarangs;
        };
        $scope.load();
        $scope.create = function() {
            $scope.penerimaanBarang.$save(function() {
                $scope.load();
                $scope.close();
                $scope.clearCart();
            });
        };
        $scope.update = function() {
            $scope.penerimaanBarang.$update(function() {
                $scope.load();
                $scope.close();
            });
        };
        $scope.delete = function(penerimaanBarang) {
            var confirmDelete = $window.confirm("Apakah Anda Yakin?");
            if (confirmDelete) {
                penerimaanBarang.$delete(function() {
                    $scope.load();
                    $scope.close();
                });
            }
        };
        $scope.openRead = function(penerimaanBarang) {
            $scope.close();
            $scope.newForm = false;
            $scope.penerimaanBarang = angular.copy(penerimaanBarang);
            $scope.modalInstance = $modal.open({
                templateUrl: "modules/penerimaanbarang/views/detail-penerimaanbarang.views.html",
                size: "lg",
                backdrop: "static",
                scope: $scope
            });
        };
        $scope.openUpdate = function(penerimaanBarang) {
            $scope.close();
            $scope.newForm = false;
            $scope.penerimaanBarang = angular.copy(penerimaanBarang);
            $scope.modalInstance = $modal.open({
                templateUrl: "modules/penerimaanbarang/views/form-penerimaanbarang.views.html",
                size: "lg",
                backdrop: "static",
                scope: $scope
            });
        };
        $scope.removeDetail = function(index) {
            $scope.penerimaanBarang.lpbItemsList.splice(index, 1);
        };
    })
    .controller("createPenerimaanBarangController", function($scope, $filter, penerimaanBarangFactory, pesananBarang) {
        $scope.newForm = true;
        $scope.penerimaanBarang = new penerimaanBarangFactory({
            tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
            sp: pesananBarang.nomor,

        });
        $scope.create = function() {
            $scope.barang.$save(function() {
                $scope.$close();
            });
        };
    });