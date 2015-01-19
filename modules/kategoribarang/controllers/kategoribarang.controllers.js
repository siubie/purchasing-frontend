'use strict';

angular.module('kategoriBarangControllers', [])
.controller('kategoriBarangController', ['$scope', '$window', '$state', '$stateParams', '$modal', 'kategoriBarangFactory',
function($scope, $window, $state, $stateParams, $modal, kategoriBarangFactory) {
	$scope.sort = "kategori";
	$scope.kategoriBarangs = kategoriBarangFactory.query();
	$scope.kategoriBarang = new kategoriBarangFactory();
	$scope.status = $state.$current.data;
	$scope.create = function() {
		$scope.kategoriBarang.$save(function() {
			$state.go('listKategoriBarangState');
		});
	};
	$scope.update = function() {
		$scope.kategoriBarang.$update(function() {
			$state.go('listKategoriBarangState');
		});
	};
	$scope.delete = function(kategoriBarang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			if ( kategoriBarang ) {
				kategoriBarang.$delete();
				for (var i in $scope.kategoriBarangs) {
					if ($scope.kategoriBarangs [i] === kategoriBarang) {
						$scope.kategoriBarangs.splice(i, 1);
					};
				};
			} else {
				$scope.kategoriBarang.$delete(function() {
					$state.go('listKategoriBarangState');
				});
			};
		}
		else {
			$state.go('listKategoriBarangState');
		};
	};
	$scope.find = function() {
		$scope.kategoriBarang = kategoriBarangFactory.get({
			id: $stateParams.id
		});
	};
	$scope.back = function() {
		$state.go('listKategoriBarangState');
	};
	$scope.openDetail = function (kategoriBarang) {
		$scope.kategoriBarang = kategoriBarang;
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/read-kategoribarang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.closeDetail = function(){
		$scope.modalInstance.dismiss();
	}
}]);
