angular.module('kategoriBarang.controllers',[])
.controller('kategoriBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'kategoriBarangFactory',
function($scope, $window, $state, $modal, $filter, kategoriBarangFactory) {
	$scope.sort = "kategori";
	$scope.kategoriBarangs = kategoriBarangFactory.query();
	$scope.kategoriBarang = new kategoriBarangFactory();
	$scope.create = function(){
		$scope.kategoriBarang.$save(function(){
			$scope.kategoriBarangs = kategoriBarangFactory.query();
			$scope.close();
		});
	};
	$scope.update = function(){
		$scope.kategoriBarang.$update(function(){
			$scope.kategoriBarangs = kategoriBarangFactory.query();
			$scope.close();
		});
	};
	$scope.delete = function(kategoriBarang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			kategoriBarang.$delete(function(){
				$scope.kategoriBarangs = kategoriBarangFactory.query();
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
			size: 'sm',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openRead = function(kategoriBarang){
		$scope.close();
		$scope.kategoriBarang = angular.copy(kategoriBarang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/read-kategoribarang.views.html',
			size: 'sm',
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
			size: 'sm',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.checkAll = function(){
		angular.forEach($scope.filtered, function(kategoriBarang){
			kategoriBarang.selected=$scope.selectedAll;
		});
	};
	$scope.uncheckAll = function(selected){
		if(!selected){
			$scope.selectedAll=false;
		}
	};
	$scope.deleteSelected = function(){
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if (confirmDelete){
			var spliceSelected = function(i){
				// console.log("deleting : ",$scope.kategoriBarangs[i]);
				$scope.kategoriBarangs.splice(i, 1);
			};
			var i = $scope.kategoriBarangs.length;
			while (i--){
				if ($scope.kategoriBarangs[i].selected){
					$scope.kategoriBarangs[i].$delete(spliceSelected(i));
				}
			}
		}
	};
	$scope.$watch('kategoriBarangs',function(){
		$scope.selected = $filter('filter')($scope.kategoriBarangs, {selected:'true'});
	},true);
}]);
