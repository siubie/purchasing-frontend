'use strict';

angular.module('purchasingApp', [
	'ngResource',
	'ngSanitize',
	'ngTable',
	'ui.select',
	'ui.router',
	'ui.bootstrap.transition',
	'ui.bootstrap.modal',
	'ui.bootstrap.datepicker',
	'purchasingRoutes',
	'departemenServices',
	'satuanGudangServices',
	'kategoriBarangRoutes', 'kategoriBarangControllers', 'kategoriBarangServices',
	'barangRoutes', 'barangControllers', 'barangServices',
	'permintaanBarangRoutes', 'permintaanBarangControllers', 'permintaanBarangServices'
]);

angular.module('purchasingRoutes', []).config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/permintaanbarang/');
});
