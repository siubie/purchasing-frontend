angular.module('barang.controllers',[])
.controller('barangController', ['$scope', '$window', '$state', '$modal', '$filter', 'satuanGudangFactory', 'kategoriBarangFactory', 'barangFactory',
function($scope, $window, $state, $modal, $filter, satuanGudangFactory, kategoriBarangFactory, barangFactory) {
	$scope.fields = [
		{"name":"kode","type":"string","header":"Kode"},
		{"name":"kategori","type":"string","header":"kategori"},
		{"name":"nama","type":"string","header":"Nama"},
		{"name":"alias","type":"string","header":"Alias"},
		{"name":"satuan","type":"string","header":"Satuan"},
		{"name":"deskripsi","type":"string","header":"Deskripsi"}
	];
	$scope.Math = window.Math;
	$scope.sort = "kode";
	$scope.reverse = false;
	$scope.barang = new barangFactory();
	$scope.load = function(){
		$scope.kategoriBarangs = kategoriBarangFactory.query();
		$scope.satuanGudangs = satuanGudangFactory.query();
		$scope.barangs = barangFactory.query();
		$scope.items = $scope.barangs;
	};
	$scope.create = function(){
		$scope.barang.$save(function(){
			$scope.load();
			$scope.close();
		});
	};
	$scope.update = function(){
		$scope.barang.$update(function(){
			$scope.load();
			$scope.close();
		});
	};
	$scope.delete = function(barang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			barang.$delete(function(){
				$scope.load();
				$scope.close();
			});
		}
	};
	$scope.close = function(){
		if ($scope.modalInstance)
		{
			$scope.modalInstance.dismiss();
		}
	};
	$scope.openCreate = function(){
		$scope.close();
		$scope.status = true;
		$scope.barang = new barangFactory();
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/barang/views/form-barang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openRead = function(barang){
		$scope.close();
		$scope.barang = angular.copy(barang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/barang/views/detail-barang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openUpdate = function(barang){
		$scope.close();
		$scope.status = false;
		$scope.barangOld = angular.copy(barang);
		$scope.barang = angular.copy(barang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/barang/views/form-barang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.log = function(){
		console.log("clicked");
	};
}]);
