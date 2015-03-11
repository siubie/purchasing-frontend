angular.module("purchasingApp", [
    "angular-loading-bar",
    "ngAnimate",
    "ngResource",
    "ui.router",
    "ui.bootstrap.transition",
    "ui.bootstrap.modal",
    "ui.bootstrap.datepicker",
    "ui.bootstrap.dropdown",
    "ui.bootstrap.typeahead",
    "ui.bootstrap.popover",
    "purchasing.routes",
    "kategoriBarang",
    "departemen",
    "satuanGudang",
    "permintaanBarang",
    "barang",
    "supplier",
    "pesananBarang",
    "penerimaanBarang",
    "fyGrid"
]);

angular.module("purchasing.routes", []).config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise("/pesananbarang/");
});