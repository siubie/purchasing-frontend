angular.module('pesananBarang.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridPesananBarangState', {
        url: '/pesananbarang/',
        templateUrl: 'modules/pesananbarang/views/grid-pesananbarang.views.html',
        controller: 'pesananBarangController'
    });
});