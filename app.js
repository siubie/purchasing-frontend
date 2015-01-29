angular.module('purchasingApp', [
	'angular-loading-bar',
	'ngAnimate',
	'ngResource',
	'ngSanitize',
	'ui.select',
	'ui.router',
	'ui.bootstrap.transition',
	'ui.bootstrap.modal',
	'ui.bootstrap.datepicker',
	'ui.bootstrap.dropdown',
	'purchasing.routes',
	'kategoriBarang',
	'departemen',
	'satuanGudang',
	'permintaanBarang',
	'barang',
]);

angular.module('purchasing.routes', [])
.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/kategoribarang/');
});
