angular.module('permintaanBarang.routes', []).config(function($stateProvider) {
    $stateProvider
        .state('gridPermintaanBarangState', {
            url: '/permintaanbarang/',
            templateUrl: 'modules/permintaanbarang/views/grid-permintaanbarang.views.html',
            controller: 'permintaanBarangController'
        });
});