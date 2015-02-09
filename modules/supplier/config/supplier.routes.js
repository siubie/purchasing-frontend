angular.module('supplier.routes', []).config(function($stateProvider) {
    $stateProvider.state('gridSupplierState', {
        url: '/supplier/',
        templateUrl: 'modules/supplier/views/grid-supplier.views.html',
        controller: 'supplierController'
    });
});