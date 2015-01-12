'use strict';

angular.module('kategoriBarangRoutes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listKategoriBarangState', {
		url: '/kategoribarang/',
		templateUrl: 'modules/kategoribarang/views/list-kategoribarang.views.html',
		controller: 'kategoriBarangController'
	})
	.state('readKategoriBarangState', {
		url: '/kategoribarang/:id/',
		templateUrl: 'modules/kategoribarang/views/read-kategoribarang.views.html',
		controller: 'kategoriBarangController'
	})
	.state('createKategoriBarangState', {
		url: '/kategoribarang/create',
		templateUrl: 'modules/kategoribarang/views/create-kategoribarang.views.html',
		controller: 'kategoriBarangController'
	})
	.state('updateKategoriBarangState', {
		url: '/kategoribarang/:id/update',
		templateUrl: 'modules/kategoribarang/views/update-kategoribarang.views.html',
		controller: 'kategoriBarangController'
	});
});