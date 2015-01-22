'use strict';

angular.module('purchasingApp', [
	'ngAnimate',
	'ngResource',
	'ngSanitize',
	'ui.select',
	'ui.router',
	'ui.bootstrap.pagination',
	'ui.bootstrap.transition',
	'ui.bootstrap.modal',
	'ui.bootstrap.datepicker',
	'ui.bootstrap.progressbar',
	'angular-loading-bar',
	'purchasingRoutes',
	'departemenServices',
	'satuanGudangServices',
	'kategoriBarangRoutes', 'kategoriBarangControllers', 'kategoriBarangServices', 'kategoriBarangFilters',
	'barangRoutes', 'barangControllers', 'barangServices',
	'permintaanBarangRoutes', 'permintaanBarangControllers', 'permintaanBarangServices'
]);

angular.module('purchasingRoutes', []).config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/kategoribarang/');
});
