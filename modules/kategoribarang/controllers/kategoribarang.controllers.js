'use strict';

angular.module('kategoriBarangControllers', [])
.controller('kategoriBarangController', ['$scope', '$window', '$state', '$stateParams', '$modal', 'kategoriBarangFactory',
function($scope, $window, $state, $stateParams, $modal, kategoriBarangFactory) {
	$scope.sort = "kategori";
	$scope.load = function(){
		$scope.kategoriBarangs = kategoriBarangFactory.query();
		$scope.kategoriBarang = new kategoriBarangFactory;
	};
	$scope.close = function(){
		$scope.modalInstance.dismiss();
	};
	$scope.openCreate = function () {
		$scope.status = true;
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/form-kategoribarang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.create = function(kategoriBarang) {
		$scope.kategoriBarang.$save(function() {
			$scope.kategoriBarangs.push(kategoriBarang);
			$scope.load();
			$scope.close();
		});
	};
	$scope.openRead = function (kategoriBarang) {
		$scope.kategoriBarang = angular.copy(kategoriBarang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/kategoribarang/views/read-kategoribarang.views.html',
			size: 'md',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openUpdate = function (kategoriBarang) {
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
	$scope.update = function(kategoriBarang) {
		$scope.kategoriBarang.$update(function() {
			index = $scope.kategoriBarangs.indexOf($scope.kategoriBarangOld);
			$scope.kategoriBarangs[index] = kategoriBarang;
			$scope.load();
			$scope.close();
		});
	};
	$scope.delete = function(kategoriBarang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			kategoriBarang.$delete(function() {
				$scope.load();
			});
		};
		$state.go('listKategoriBarangState');
	};
	$scope.checkAll = function(){
		angular.forEach($scope.filtered, function(kategoriBarang){
			kategoriBarang.selected=$scope.selectedAll;
		});
	};
	$scope.uncheckAll = function(selected){
		if(!selected){
			$scope.selectedAll=false;
		};
	};
	$scope.deleteSelected = function(){
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if (confirmDelete){
			var i = $scope.kategoriBarangs.length;
			while (i--) {
				if ($scope.kategoriBarangs[i].selected){
					$scope.kategoriBarangs[i].$delete(function(){
						$scope.kategoriBarangs.splice(i, 1);
					});
				};
			};
		};
	};
}]);
