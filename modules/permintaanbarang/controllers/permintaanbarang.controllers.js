'use strict';

angular.module('permintaanBarangControllers', [])
.controller('permintaanBarangController', ['$scope', '$http', '$window', '$state', '$stateParams', '$modal', 'departemenFactory', 'barangFactory', 'permintaanBarangFactory',
function($scope, $http, $window, $state, $stateParams, $modal, departemenFactory, barangFactory, permintaanBarangFactory, dateFactory) {
	$scope.sort = "noSpp";
	$scope.departemens = departemenFactory.query();
	$scope.barangs = barangFactory.query();
	$scope.permintaanBarang = new permintaanBarangFactory({
		tglPermintaan: new Date(),
		jenis: false,
		periode: new Date(),
		lineItemsSppList: new Array({
			tglButuh: new Date()
		})
	});
	$scope.permintaanBarangs = permintaanBarangFactory.query();
	$scope.status = $state.$current.data;
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
		$scope.permintaanBarang = permintaanBarangFactory.get({ id: $stateParams.id	});
	};
	$scope.addDetail = function () {
		$scope.permintaanBarang.lineItemsSppList.push({
			tglButuh: new Date()
		});
	};
	$scope.removeDetail = function(index) {
		$scope.permintaanBarang.lineItemsSppList.splice(index, 1);
	};
	$scope.back = function() {
		$state.go('listPermintaanBarangState');
	};
	$scope.openCalendar = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope[opened] = true;
	};
	$scope.openTglButuh = function($event, detailBarang) {
		$event.preventDefault();
		$event.stopPropagation();
		detailBarang.openedTglButuh = true;
	};
	$scope.openDetail = function (permintaanBarang) {
		$scope.permintaanBarang = permintaanBarang;
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/permintaanbarang/views/read-permintaanbarang.views.html',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.closeDetail = function(){
		$scope.modalInstance.dismiss();
	};
}]);
