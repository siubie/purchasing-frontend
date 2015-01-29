angular.module('barang.routes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listBarangState', {
		url: '/barang/',
		templateUrl: 'modules/barang/views/list-barang.views.html',
		controller: 'barangController'
	});
});
