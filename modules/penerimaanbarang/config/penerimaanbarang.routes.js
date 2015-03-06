angular.module('penerimaanBarang.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridPenerimaanBarangState', {
        url: '/penerimaanbarang/',
        templateUrl: 'modules/penerimaanbarang/views/grid-penerimaanbarang.views.html',
        controller: 'penerimaanBarangController'
    });
});