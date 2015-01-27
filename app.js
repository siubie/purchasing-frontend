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
