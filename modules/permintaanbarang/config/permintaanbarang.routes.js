'use strict';

angular.module('permintaanBarangRoutes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listPermintaanBarangState', {
		url: '/permintaanbarang/',
		templateUrl: 'modules/permintaanbarang/views/list-permintaanbarang.views.html',
		controller: 'permintaanBarangController'
	})
	.state('readPermintaanBarangState', {
		url: '/permintaanbarang/:id/',
		templateUrl: 'modules/permintaanbarang/views/read-permintaanbarang.views.html',
		controller: 'permintaanBarangController'
	})
	.state('createPermintaanBarangState', {
		url: '/permintaanbarang/create',
		templateUrl: 'modules/permintaanbarang/views/create-permintaanbarang.views.html',
		controller: 'permintaanBarangController'
	})
	.state('updatePermintaanBarangState', {
		url: '/permintaanbarang/:id/update',
		templateUrl: 'modules/permintaanbarang/views/update-permintaanbarang.views.html',
		controller: 'permintaanBarangController'
	});
});