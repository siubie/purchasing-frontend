angular.module('kategoriBarang.routes', [])
.config(function($stateProvider) {
	$stateProvider
	.state('listKategoriBarangState', {
		url: '/kategoribarang/',
		templateUrl: 'modules/kategoribarang/views/list-kategoribarang.views.html',
		controller: 'kategoriBarangController'
	});
});
