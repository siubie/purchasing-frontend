angular.module('barang.routes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listBarangState', {
		url: '/barang/',
		templateUrl: 'modules/barang/views/list-barang.views.html',
		controller: 'barangController'
	})
	.state('createBarangState', {
		url: '/barang/create',
		templateUrl: 'modules/barang/views/form-barang.views.html',
		controller: 'barangController',
		data: true
	})
	.state('updateBarangState', {
		url: '/barang/:id/update',
		templateUrl: 'modules/barang/views/form-barang.views.html',
		controller: 'barangController',
		data: false
	});
});
