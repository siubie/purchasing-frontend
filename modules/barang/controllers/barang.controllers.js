'use strict';

angular.module('barangControllers', [])
.controller('barangController', ['$scope', '$window', '$state', '$stateParams', '$modal', 'kategoriBarangFactory', 'satuanGudangFactory', 'barangFactory',
function($scope, $window, $state, $stateParams, $modal, kategoriBarangFactory, satuanGudangFactory, barangFactory) {
	$scope.sort = "nama";
	$scope.kategoriBarangs = kategoriBarangFactory.query();
	$scope.satuanGudangs = satuanGudangFactory.query();
	$scope.barangs = barangFactory.query();
	$scope.barang = new barangFactory();
	$scope.status = $state.$current.data;
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
		$scope.barang = barangFactory.get({
			id: $stateParams.id,
		});
	};
	$scope.back = function() {
		$state.go('listBarangState');
	};
	$scope.openDetail = function (barang) {
		$scope.barang = barang;
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/barang/views/read-barang.views.html',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.closeDetail = function(){
		$scope.modalInstance.dismiss();
	};
}]);
