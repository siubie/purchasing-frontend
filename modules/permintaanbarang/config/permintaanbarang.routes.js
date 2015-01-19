'use strict';

angular.module('permintaanBarangRoutes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listPermintaanBarangState', {
		url: '/permintaanbarang/',
		templateUrl: 'modules/permintaanbarang/views/list-permintaanbarang.views.html',
		controller: 'permintaanBarangController'
	})
	.state('createPermintaanBarangState', {
		url: '/permintaanbarang/create',
		templateUrl: 'modules/permintaanbarang/views/form-permintaanbarang.views.html',
		controller: 'permintaanBarangController',
		data: true
	})
	.state('updatePermintaanBarangState', {
		url: '/permintaanbarang/:id/update',
		templateUrl: 'modules/permintaanbarang/views/form-permintaanbarang.views.html',
		controller: 'permintaanBarangController',
		data: false
	});
});
