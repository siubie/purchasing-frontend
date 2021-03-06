angular.module("penjualanWaste.controllers", []).controller("penjualanWasteController", function($filter, $modal, $scope, $window, penjualanWasteFactory, wasteFactory) {
    $scope.module = "penjualanWaste";
    $scope.access = {
        create: true,
        update: true,
        delete: true
    };
    $scope.fields = [{
        name: "nomor",
        type: "string",
        header: "Nomor",
        grid: true,
        warning: true
    }, {
        name: "tanggal",
        type: "date",
        header: "Tanggal",
        grid: true,
        warning: true
    }, {
        name: "nama",
        type: "string",
        header: "Nama",
        grid: true,
        warning: true
    }, {
        name: "alamat",
        type: "string",
        header: "Alamat",
        grid: true,
        warning: true
    }];
    $scope.sort = {
        field: "nomor",
        order: true
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
    $scope.get = function(id) {
        $scope.penjualanWaste = penjualanWasteFactory.get({
            id: id
        }, function() {
            $scope.penjualanWaste.editable = true;
        });
    };
    $scope.new = function() {
        $scope.penjualanWaste = new penjualanWasteFactory({
            nomor: "PW" + new Date().getTime(),
            tanggal: new Date(),
            wasteItemsList: [],
            editable: true
        });
    };
    $scope.new();
    $scope.warning = function(process) {
        var warning = "Anda Akan ";
        switch (process) {
            case "create":
                warning = warning + "Membuat ";
                break;
            case "update":
                warning = warning + "Mengubah ";
                break;
            case "delete":
                warning = warning + "Menghapus ";
                break;
        }
        warning = warning + "Data Retur Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "nomor") {
                field.warning = false;
            }
            if (field.warning && !!$scope.penjualanWaste[field.name]) {
                switch (field.type) {
                    case "string":
                        warning = warning + field.header + " : " + $scope.penjualanWaste[field.name] + "\n";
                        break;
                    case "date":
                        warning = warning + field.header + " : " + $filter('date')($scope.penjualanWaste[field.name], field.filter) + "\n";
                        break;
                }
            }
        });
        warning = warning + "Item Barang : \n";
        angular.forEach($scope.penjualanWaste.wasteItemsList, function(itemBarang, i) {
            warning = warning + "     " + (i + 1) + ". " + itemBarang.waste.nama + " " + itemBarang.jumlah + " " + itemBarang.waste.satuan + "\n";
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.penjualanWaste.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Penjualan Waste Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.penjualanWaste.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Penjualan Waste Telah Diubah...");
            });
        }
    };
    $scope.delete = function(penjualanWaste) {
        if (!!penjualanWaste) {
            $scope.penjualanWaste = penjualanWaste;
        }
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            $scope.penjualanWaste.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Penjualan Waste Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.getTotalCost = function() {
        var getTotalCost = 0;
        angular.forEach($scope.penjualanWaste.wasteItemsList, function(itemWaste) {
            getTotalCost = getTotalCost + (itemWaste.harga * itemWaste.jumlah);
        });
        return getTotalCost;
    };
    $scope.addDetail = function(index) {
        $scope.penjualanWaste.wasteItemsList.push({
            jumlah: 1,
            harga: 0
        });
    };
    $scope.removeDetail = function(index) {
        $scope.penjualanWaste.wasteItemsList.splice(index, 1);
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.addDetail();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(penjualanWaste) {
        $scope.get(penjualanWaste.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/detail-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
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
        $scope.get(penjualanWaste.nomor);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/penjualanwaste/views/form-penjualanwaste.views.html",
            size: "lg",
            backdrop: "static",
            windowClass: "app-modal-window",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
});