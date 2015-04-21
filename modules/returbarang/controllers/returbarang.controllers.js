angular.module("returBarang.controllers", []).controller("returBarangController", function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, returBarangFactory) {
    $scope.module = "returBarang";
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
        "name": "status",
        "header": "Status",
        "type": "string"
    }];
    $scope.sort = {
        "field": "nomor",
        "order": true
    };
    $scope.newForm = true;
    $scope.new = function() {
        if (!!localStorage.penerimaanBarang) {
            penerimaanBarang = JSON.parse(localStorage.penerimaanBarang);
            $scope.returBarang = new returBarangFactory({
                nomor: "LPBR" + new Date().getTime(),
                tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
                tanggalDatang: penerimaanBarang.tanggalDatang,
                lpb: penerimaanBarang.nomor,
                sp: penerimaanBarang.sp,
                supplier: penerimaanBarang.supplier,
                nomorSj: penerimaanBarang.nomorSj,
                diskon: penerimaanBarang.diskon,
                kurs: penerimaanBarang.kurs,
                valuta: penerimaanBarang.valuta,
                valutaBayar: penerimaanBarang.valutaBayar,
                status: "RECEIVED",
                returItemsList: []
            });
            angular.forEach(penerimaanBarang.lpbItemsList, function(itemBarang) {
                $scope.returBarang.returItemsList.push({
                    barang: itemBarang.barang,
                    qtyDatang: itemBarang.qty,
                    qtyRetur: 1,
                    harga: itemBarang.harga,
                    status: "RECEIVED"
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
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("returBarang : ", JSON.stringify($scope.returBarang));
        $scope.returBarang.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(returBarang) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            returBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                $scope.load();
            });
        }
    };
    $scope.openRead = function(returBarang) {
        $scope.newForm = false;
        angular.copy(returBarang,$scope.returBarang);
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
        $scope.newForm = false;
        angular.copy(returBarang,$scope.returBarang);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/returbarang/views/form-returbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
    };
    $scope.removeDetail = function(index) {
        $scope.returBarang.returItemsList.splice(index, 1);
    };
});