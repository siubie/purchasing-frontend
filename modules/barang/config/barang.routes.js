'use strict';

angular.module('barangRoutes', [])
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
	.state('readBarangState', {
		url: '/barang/:id/',
		templateUrl: 'modules/barang/views/read-barang.views.html',
		controller: 'barangController'
	})
	.state('updateBarangState', {
		url: '/barang/:id/update',
		templateUrl: 'modules/barang/views/form-barang.views.html',
		controller: 'barangController',
		data: false
	});
});
