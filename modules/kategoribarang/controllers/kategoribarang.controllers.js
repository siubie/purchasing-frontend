angular.module('kategoriBarang.controllers',[])
.controller('kategoriBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'kategoriBarangFactory',
function($scope, $window, $state, $modal, $filter, kategoriBarangFactory) {
	$scope.Math = window.Math;
	$scope.sort = "kategori";
	$scope.kategoriBarang = new kategoriBarangFactory();
	$scope.load = function(){
		$scope.kategoriBarangs = kategoriBarangFactory.query();
	};
	$scope.create = function(){
		$scope.kategoriBarang.$save(function(){
			$scope.load();
			$scope.close();
		});
	};
	$scope.update = function(){
		$scope.kategoriBarang.$update(function(){
			$scope.load();
			$scope.close();
		});
	};
	$scope.delete = function(kategoriBarang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			kategoriBarang.$delete(function(){
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
		$scope.kategoriBarang = new kategoriBarangFactory();
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/form-kategoribarang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openRead = function(kategoriBarang){
		$scope.close();
		$scope.kategoriBarang = angular.copy(kategoriBarang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/read-kategoribarang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openUpdate = function(kategoriBarang){
		$scope.close();
		$scope.status = false;
		$scope.kategoriBarangOld = angular.copy(kategoriBarang);
		$scope.kategoriBarang = angular.copy(kategoriBarang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/form-kategoribarang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.checkDisplayed = function(){
		angular.forEach($scope.displayed, function(kategoriBarang){
			kategoriBarang.selected=$scope.selectedAll;
		});
	};
	$scope.uncheckDisplayed = function(selected){
		if(!selected){
			$scope.selectedAll=false;
		}
	};
	$scope.uncheckAll = function(){
		angular.forEach($scope.selected, function(kategoriBarang){
			kategoriBarang.selected=false;
		});
	};
	$scope.deleteSelected = function(){
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if (confirmDelete){
			var spliceSelected = function(i){
				$scope.kategoriBarangs.splice(i, 1);
			};
			var i = $scope.selected.length;
			while (i--){
				if ($scope.selected[i].selected){
					$scope.selected[i].$delete(spliceSelected(i));
				}
			}
		}
	};
	$scope.$watch('kategoriBarangs',function(){
		$scope.selected = $filter('filter')($scope.kategoriBarangs, {selected:'true'});
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
		angular.forEach($scope.displayed, function(kategoriBarang){
			if(!kategoriBarang.selected){
				$scope.selectedAll = false;
			}
		});
	},true);
	$scope.$watch('currentPage',function(){
		if($scope.currentPage>$scope.maxPage)
		{
			$scope.currentPage=$scope.maxPage;
		}
	});
}]);
