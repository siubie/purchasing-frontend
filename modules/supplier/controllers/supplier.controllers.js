angular.module("supplier.controllers", []).controller("supplierController", function($modal, $scope, $window, kategoriBarangFactory, supplierFactory) {
    $scope.module = "supplier";
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
        name: "alamat",
        type: "string",
        header: "Alamat",
        grid: true,
        warning: true
    }, {
        name: "nomorTelepon",
        type: "string",
        header: "Telepon",
        grid: true,
        warning: true
    }, {
        name: "kategori",
        type: "array",
        header: "Golongan",
        grid: true,
        warning: true
    }];
    $scope.sort = {
        field: "nama",
        order: false
    };
    $scope.query = function() {
        $scope.kategoriBarangs = kategoriBarangFactory.query();
        $scope.suppliers = supplierFactory.query(function() {
            angular.forEach($scope.suppliers, function(supplier) {
                supplier.editable = true;
            });
        });
        $scope.items = $scope.suppliers;
    };
    $scope.query();
    $scope.get = function(id) {
        $scope.supplier = supplierFactory.get({
            id: id
        }, function() {
            $scope.supplier.editable = true;
        });
    };
    $scope.new = function() {
        $scope.supplier = new supplierFactory({
            kode: "SUP" + new Date().getTime(),
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
        warning = warning + "Data Supplier Berikut : \n\n";
        angular.forEach($scope.fields, function(field) {
            if (process == "create" && field.name == "kode") {
                field.warning = false;
            }
            if (field.warning && !!$scope.supplier[field.name]) {
                warning = warning + field.header + " : " + $scope.supplier[field.name] + "\n";
            }
        });
        warning = warning + "\nApakah Anda Yakin?";
        return warning;
    };
    $scope.create = function() {
        var confirm = $window.confirm($scope.warning("create"));
        if (confirm) {
            $scope.supplier.$save(function() {
                $scope.modalInstance.close();
                toastr.success("Data Supplier Telah Dibuat...");
            });
        }
    };
    $scope.update = function() {
        var confirm = $window.confirm($scope.warning("update"));
        if (confirm) {
            $scope.supplier.$update(function() {
                $scope.modalInstance.close();
                toastr.success("Data Supplier Telah Diubah...");
            });
        }
    };
    $scope.delete = function(supplier) {
        $scope.supplier = supplier;
        var confirm = $window.confirm($scope.warning("delete"));
        if (confirm) {
            supplier.$delete(function() {
                if (!!$scope.modalInstance) {
                    $scope.modalInstance.close();
                    toastr.success("Data Supplier Telah Dihapus...");
                }
                $scope.query();
            });
        }
    };
    $scope.openCreate = function() {
        $scope.newForm = true;
        $scope.new();
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/supplier/views/form-supplier.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
    $scope.openRead = function(supplier) {
        $scope.get(supplier.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/supplier/views/detail-supplier.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then({}, function(reason) {
            if (reason == "update") {
                $scope.openUpdate(supplier);
            }
        });
    };
    $scope.openUpdate = function(supplier) {
        $scope.newForm = false;
        $scope.get(supplier.kode);
        $scope.modalInstance = $modal.open({
            templateUrl: "modules/supplier/views/form-supplier.views.html",
            size: "lg",
            backdrop: "static",
            scope: $scope
        });
        $scope.modalInstance.result.then(function() {
            $scope.query();
        });
    };
});