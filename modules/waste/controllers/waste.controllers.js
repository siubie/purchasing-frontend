angular.module("waste.controllers", []).controller("wasteController", function($modal, $scope, $window, satuanGudangFactory, wasteFactory) {
    $scope.module = "waste";
    $scope.access = {
        create: true,
        update: true,
        delete: true
    };
    $scope.fields = [{
        name: "kode",
        type: "string",
        header: "Kode",
        grid: true,
        warning: true
    }, {
        name: "nama",
        type: "string",
        header: "Nama",
        grid: true,
        warning: true
    }, {
        name: "satuan",
        type: "string",
        header: "Satuan",
        grid: true,
        warning: true
    }];
    $scope.sort = {
        field: "nama",
        order: false
    };
    $scope.query = function() {
        $scope.satuanGudangs = satuanGudangFactory.query(function() {
            $scope.satuanGudangArray = [];
            angular.forEach($scope.satuanGudangs, function(satuanGudang) {
                $scope.satuanGudangArray.push(satuanGudang.satuan);
            });
            $scope.satuanGudangArray.sort();
        });
        $scope.wastes = wasteFactory.query(function() {
            angular.forEach($scope.wastes, function(waste) {
                waste.editable = true;
            });
        });
        $scope.items = $scope.wastes;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.waste = wasteFactory.get({
            id: id
        }, function() {
            $scope.waste.editable = true;
        });
    };
    $scope.new = function() {
        $scope.waste = new wasteFactory({
            kode: "WST" + new Date().getTime(),
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
        warning = warning + "Data Katalog Barang Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "kode") {
                field.warning = false;
            }
            if (field.warning && !!$scope.waste[field.name]) {
                warning = warning + field.header + " : " + $scope.waste[field.name] + "\n";
            }
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.waste.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Waste Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.waste.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Waste Telah Diubah...");
            });
        }
    };
    $scope.delete = function(waste) {
        if (!!waste) {
            $scope.waste = waste;
        }
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            $scope.waste.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                toastr.success("Data Waste Telah Dihapus...");
                $scope.query();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/form-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(waste) {
        $scope.get(waste.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/detail-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(waste);
            }
        });
    };
    $scope.openUpdate = function(waste) {
        $scope.newForm = false;
        $scope.get(waste.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/waste/views/form-waste.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope,
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
});