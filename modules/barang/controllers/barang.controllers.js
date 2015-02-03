angular.module('barang.controllers',[])
.controller('barangController', ['$scope', '$window', '$state', '$modal', '$filter', 'satuanGudangFactory', 'kategoriBarangFactory', 'barangFactory',
function($scope, $window, $state, $modal, $filter, satuanGudangFactory, kategoriBarangFactory, barangFactory) {
	$scope.Math = window.Math;
	$scope.sort = "kode";
	$scope.barang = new barangFactory();
	$scope.load = function(){
		$scope.kategoriBarangs = kategoriBarangFactory.query();
		$scope.satuanGudangs = satuanGudangFactory.query();
		$scope.barangs = barangFactory.query();
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
			templateUrl: 'modules/barang/views/read-barang.views.html',
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
	$scope.checkDisplayed = function(){
		angular.forEach($scope.displayed, function(barang){
			barang.selected=$scope.selectedAll;
		});
	};
	$scope.uncheckDisplayed = function(selected){
		if(!selected){
			$scope.selectedAll=false;
		}
	};
	$scope.uncheckAll = function(){
		angular.forEach($scope.selected, function(barang){
			barang.selected=false;
		});
	};
	$scope.deleteSelected = function(){
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if (confirmDelete){
			var spliceSelected = function(i){
				$scope.barangs.splice(i, 1);
			};
			var i = $scope.selected.length;
			while (i--){
				if ($scope.selected[i].selected){
					$scope.selected[i].$delete(spliceSelected(i));
				}
			}
		}
	};
	$scope.$watch('barangs',function(){
		$scope.selected = $filter('filter')($scope.barangs, {selected:'true'});
	},true);
	$scope.$watchCollection('search',function(){
		$scope.currentPage=1;
	});
	$scope.$watchCollection('displayed',function(){
		if($scope.selectedAll){
			$scope.selectedAll = false;
		}
	});
	$scope.$watch('displayed',function(){
		$scope.selectedAll = true;
		angular.forEach($scope.displayed, function(barang){
			if(!barang.selected){
				$scope.selectedAll = false;
			}
		});
	},true);
}]);
