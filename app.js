angular.module("purchasingApp", [
    "angular-loading-bar",
    "ngAnimate",
    "ngResource",
    "ui.router",
    "ui.select",
    "ui.utils",
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
    "konversiSatuan",
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
    $urlRouterProvider.otherwise("/barang/");
});

angular.module('purchasing.services', []).factory('constFactory', function() {
    return {
        env: "production"
    };
});