'use strict';

angular.module('barangControllers', [])
.controller('barangController', ['$scope', '$window', '$state', '$stateParams', 'kategoriBarangFactory', 'satuanGudangFactory', 'barangFactory',
function($scope, $window, $state, $stateParams, kategoriBarangFactory, satuanGudangFactory, barangFactory) {
	$scope.sort = "namaBarang";
	$scope.kategoriBarangs = kategoriBarangFactory.query();
	$scope.satuanGudangs = satuanGudangFactory.query();
	$scope.barang = new barangFactory();
	$scope.create = function() {
		$scope.barang.$save(function() {
			$state.go('listBarangState');
		});
	};
	$scope.update = function() {
		$scope.barang.$update(function() {
			$state.go('listBarangState');
		});
	};
	$scope.delete = function(barang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			if ( barang ) { 
				barang.$delete();
				for (var i in $scope.barangs) {
					if ($scope.barangs [i] === barang) {
						$scope.barangs.splice(i, 1);
					};
				};
			} else {
				$scope.barang.$delete(function() {
					$state.go('listBarangState');			
				});
			}
		}
		else {
			$state.go('listBarangState');
		};
	};
	$scope.find = function() {
		$scope.barangs = barangFactory.query();
	};
	$scope.findOne = function() {
		$scope.barang = barangFactory.get({ 
			id: $stateParams.id,
		});
	};
	$scope.back = function() {
		$state.go('listBarangState');
	};
}]);
