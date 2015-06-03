angular.module("purchasingApp", [
    "angular-loading-bar",
    "ngAnimate",
    "ngResource",
    "ui.router",
    "ui.select",
    "ui.bootstrap.transition",
    "ui.bootstrap.modal",
    "ui.bootstrap.datepicker",
    "ui.bootstrap.dropdown",
    "ui.bootstrap.typeahead",
    "ui.bootstrap.popover",
    "purchasing.routes",
    "purchasing.services",
    "barang",
    "departemen",
    "katalogBarang",
    "kategoriBarang",
    "penerimaanBarang",
    "penjualanWaste",
    "permintaanBarang",
    "pesananBarang",
    "returBarang",
    "satuanGudang",
    "supplier",
    "waste",
    "fyGrid"
]);

angular.module("purchasing.routes", []).config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise("/returbarang/");
});

angular.module('purchasing.services', []).factory('constFactory', function() {
    return {
        env: "local"
    };
});
