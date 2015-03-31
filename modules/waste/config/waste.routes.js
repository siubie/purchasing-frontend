angular.module('waste.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridWasteState', {
        url: '/waste/',
        templateUrl: 'modules/waste/views/grid-waste.views.html',
        controller: 'wasteController'
    });
});