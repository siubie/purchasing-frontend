'use strict';

angular.module('permintaanBarangControllers', [])
.controller('permintaanBarangController', ['$scope', '$filter', '$window', '$state', '$stateParams', 'departemenFactory', 'barangFactory', 'permintaanBarangFactory',
function($scope, $filter, $window, $state, $stateParams, departemenFactory, barangFactory, permintaanBarangFactory) {
	$scope.sort = "noSpp";
	$scope.departemens = departemenFactory.query();
	$scope.barangs = barangFactory.query();
	$scope.permintaanBarang = new permintaanBarangFactory({
		tglPermintaan: $filter('date')(new Date(), 'dd MMMM yyyy'),
		lineItemsSppList: new Array
	});
	$scope.permintaanBarangs = permintaanBarangFactory.query();
	$scope.detailBarang = new Object({
		tglButuh: $filter('date')(new Date(), 'dd MMMM yyyy')
	});
	$scope.create = function() {
		$scope.permintaanBarang.$save(function() {
			$state.go('listPermintaanBarangState');
		});
	};
	$scope.update = function() {
		$scope.permintaanBarang.$update(function() {
			$state.go('listPermintaanBarangState');
		});
	};
	$scope.delete = function(permintaanBarang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			if ( permintaanBarang ) { 
				permintaanBarang.$delete();
				for (var i in $scope.permintaanBarangs) {
					if ($scope.permintaanBarangs [i] === permintaanBarang) {
						$scope.permintaanBarangs.splice(i, 1);
					};
				};
			} else {
				$scope.permintaanBarang.$delete(function() {
					$state.go('listPermintaanBarangState');			
				});
			}
		}
		else {
			$state.go('listPermintaanBarangState');
		};
	};
	$scope.find = function() {
		$scope.barang = barangFactory.get({ id: $stateParams.id	});
	};
	
	
	$scope.addDetail = function () {
		if ($scope.detailBarang.barang && $scope.detailBarang.jumlah && $scope.detailBarang.tglButuh) {
			$scope.permintaanBarang.lineItemsSppList.push($scope.detailBarang);
			$scope.detailBarang = new Object({
				tglButuh: $filter('date')(new Date(), 'dd MMMM yyyy')
			});
		}
		else {
			console.log("KOSONG");
		};
	};
	$scope.removeDetail = function(detail) {
		for (var i in $scope.details) {
			if ($scope.details [i] === detail) {
				$scope.details.splice(i, 1);
			};
		};
	};
	
	$scope.back = function() {
		$state.go('listPermintaanBarangState');
	};
	$scope.openCalendar = function($event,opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope[opened] = true;
	};
}]);
