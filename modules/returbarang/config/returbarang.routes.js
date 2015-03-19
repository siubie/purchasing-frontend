angular.module('returBarang.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridReturBarangState', {
        url: '/returbarang/',
        templateUrl: 'modules/returbarang/views/grid-returbarang.views.html',
        controller: 'returBarangController'
    });
});