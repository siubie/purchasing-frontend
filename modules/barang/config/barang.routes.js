angular.module('barang.routes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('gridBarangState', {
		url: '/barang/',
		templateUrl: 'modules/barang/views/grid-barang.views.html',
		controller: 'barangController'
	});
});
