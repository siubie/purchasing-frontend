angular.module("returBarang.controllers", [])
    .controller("returBarangController", function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, returBarangFactory) {
        $scope.module = "returBarang";
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
        }];
        $scope.Math = window.Math;
        $scope.sort = {
            "field": "tanggal",
            "order": true
        };
        $scope.newForm = true;
        $scope.new = function() {
            if (!!localStorage.penerimaanBarang) {
                penerimaanBarang = JSON.parse(localStorage.penerimaanBarang);
                $scope.returBarang = new returBarangFactory({
                    tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
                    tanggalDatang: penerimaanBarang.tanggalDatang,
                    lpb: penerimaanBarang.nomor,
                    sp: penerimaanBarang.sp,
                    supplier: penerimaanBarang.supplier,
                    nomorSj: penerimaanBarang.nomorSj,
                    returItemsList: []
                });
                angular.forEach(penerimaanBarang.lpbItemsList, function(detailBarang) {
                    $scope.returBarang.returItemsList.push({
                        barang: detailBarang.barang,
                        qtyDatang: detailBarang.qty,
                        qtyRetur: 1,
                        harga: detailBarang.harga
                    });
                });
            }
        };
        $scope.new();
        $scope.load = function() {
            $scope.returBarangs = returBarangFactory.query();
            $scope.items = $scope.returBarangs;
        };
        $scope.load();
        $scope.create = function() {
            console.log("returBarang : ", JSON.stringify($scope.returBarang));
            $scope.returBarang.$save(function() {
                $scope.close();
            });
        };
        $scope.update = function() {
            console.log("returBarang : ", JSON.stringify($scope.returBarang));
            $scope.returBarang.$update(function() {
                $scope.close();
            });
        };
        $scope.delete = function(returBarang) {
            var confirmDelete = $window.confirm("Apakah Anda Yakin?");
            if (confirmDelete) {
                returBarang.$delete(function() {
                    $scope.load();
                    $scope.close();
                });
            }
        };
        $scope.openRead = function(returBarang) {
            $scope.close();
            $scope.newForm = false;
            $scope.returBarang = returBarang;
            $scope.modalInstance = $modal.open({
                templateUrl: "modules/returbarang/views/detail-returbarang.views.html",
                size: "lg",
                backdrop: "static",
                scope: $scope
            });
            $scope.modalInstance.result.then({}, function(reason) {
                if (reason == "update") {
                    $scope.openUpdate(returBarang);
                }
            });
        };
        $scope.openUpdate = function(returBarang) {
            $scope.close();
            $scope.newForm = false;
            $scope.returBarang = returBarang;
            $scope.modalInstance = $modal.open({
                templateUrl: "modules/returbarang/views/form-returbarang.views.html",
                size: "lg",
                backdrop: "static",
                scope: $scope
            });
            $scope.modalInstance.result.then(function() {
                $scope.load();
            });
        };
        $scope.removeDetail = function(index) {
            $scope.returBarang.returItemsList.splice(index, 1);
        };
    });