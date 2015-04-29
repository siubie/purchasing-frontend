angular.module("penerimaanBarang.controllers", []).controller("penerimaanBarangController", function($scope, $window, $state, $modal, $filter, supplierFactory, permintaanBarangFactory, penerimaanBarangFactory) {
    $scope.module = "penerimaanBarang";
    $scope.access = {
        create: false,
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
    $scope.opened = {
        "tanggalDatang": false
    };
    $scope.query = function() {
        $scope.penerimaanBarangs = penerimaanBarangFactory.query(function() {
            angular.forEach($scope.penerimaanBarangs, function(penerimaanBarang) {
                penerimaanBarang.editable = true;
            });
        });
        $scope.items = $scope.penerimaanBarangs;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.penerimaanBarang = penerimaanBarangFactory.get({
            id: id
        }, function() {
            $scope.penerimaanBarang.editable = true;
        });
    };
    $scope.new = function() {
        if (!!localStorage.pesananBarang) {
            pesananBarang = JSON.parse(localStorage.pesananBarang);
            $scope.penerimaanBarang = new penerimaanBarangFactory({
                nomor: "LPB" + new Date().getTime(),
                tanggalBuat: $filter("date")(new Date(), "yyyy-MM-dd"),
                tanggalDatang: $filter("date")(new Date(), "yyyy-MM-dd"),
                sp: pesananBarang.nomor,
                supplier: pesananBarang.supplier,
                diskon: pesananBarang.diskon,
                kurs: pesananBarang.kurs,
                valuta: pesananBarang.valuta,
                valutaBayar: pesananBarang.valutaBayar,
                status: "RECEIVED",
                lpbItemsList: [],
                editable: true
            });
            angular.forEach(pesananBarang.spItemsList, function(itemBarang) {
                $scope.penerimaanBarang.lpbItemsList.push({
                    barang: itemBarang.barang,
                    spp: itemBarang.spp,
                    qty: itemBarang.qty,
                    harga: itemBarang.harga,
                    status: "RECEIVED",
                });
            });
        }
    };
    $scope.new();
    $scope.create = function() {
        console.log("penerimaanBarang : ", JSON.stringify($scope.penerimaanBarang));
        $scope.penerimaanBarang.$save(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.update = function() {
        console.log("penerimaanBarang : ", JSON.stringify($scope.penerimaanBarang));
        $scope.penerimaanBarang.$update(function() {
            $scope.modalInstance.close();
        });
    };
    $scope.delete = function(penerimaanBarang) {
        var confirm = $window.confirm("Apakah Anda Yakin?");
        if (confirm) {
            penerimaanBarang.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                $scope.query();
            });
        }
    };
    $scope.openRead = function(penerimaanBarang) {
        $scope.get(penerimaanBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penerimaanbarang/views/detail-penerimaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(penerimaanBarang);
            }
        });
    };
    $scope.openUpdate = function(penerimaanBarang) {
        $scope.newForm = false;
        $scope.get(penerimaanBarang.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penerimaanbarang/views/form-penerimaanbarang.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openCreateReturBarang = function(penerimaanBarang) {
        $scope.newForm = true;
        localStorage.setItem("penerimaanBarang", JSON.stringify(penerimaanBarang));
        $scope.modalInstance = $modal.open({
            templateUrl: 'modules/returbarang/views/form-returbarang.views.html',
            size: 'lg',
            backdrop: 'static',
            controller: "returBarangController",
            scope: $scope
        });
    };
    $scope.removeDetail = function(index) {
        $scope.penerimaanBarang.lpbItemsList.splice(index, 1);
    };
    $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened.tanggalDatang = true;
    };
    $scope.$watch('penerimaanBarang.tanggalDatang', function() {
        $scope.penerimaanBarang.tanggalDatang = $filter('date')($scope.penerimaanBarang.tanggalDatang, 'yyyy-MM-dd');
    });
});