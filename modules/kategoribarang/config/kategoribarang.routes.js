'use strict';

angular.module('kategoriBarangRoutes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listKategoriBarangState', {
		url: '/kategoribarang/',
		templateUrl: 'modules/kategoribarang/views/list-kategoribarang.views.html',
		controller: 'kategoriBarangController'
	})
	.state('createKategoriBarangState', {
		url: '/kategoribarang/create',
		templateUrl: 'modules/kategoribarang/views/form-kategoribarang.views.html',
		controller: 'kategoriBarangController',
		data: true
	})
	.state('updateKategoriBarangState', {
		url: '/kategoribarang/:id/update',
		templateUrl: 'modules/kategoribarang/views/form-kategoribarang.views.html',
		controller: 'kategoriBarangController',
		data: false
	});
});
