angular.module('katalogBarang.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridKatalogBarangState', {
        url: '/katalogbarang/',
        templateUrl: 'modules/katalogbarang/views/grid-katalogbarang.views.html',
        controller: 'katalogBarangController'
    });
});
