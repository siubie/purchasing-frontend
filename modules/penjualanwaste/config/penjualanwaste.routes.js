angular.module('penjualanWaste.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridPenjualanWasteState', {
        url: '/penjualanwaste/',
        templateUrl: 'modules/penjualanwaste/views/grid-penjualanwaste.views.html',
        controller: 'penjualanWasteController'
    });
});
