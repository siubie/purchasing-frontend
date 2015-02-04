angular.module('permintaanBarang.controllers',[])
.controller('permintaanBarangController', ['$scope', '$window', '$state', '$modal', '$filter', 'barangFactory', 'permintaanBarangFactory',
function($scope, $window, $state, $modal, $filter, barangFactory, permintaanBarangFactory) {
	$scope.fields = [
		{"name":"nomor","header":"Nomor","type":"string"},
		{"name":"tanggal","header":"Tanggal","type":"date","filter":"longDate"},
		{"name":"jenis","header":"Jenis","type":"jenis"},
		{"name":"departemen.departemen","header":"Peminta","type":"string"},
		{"name":"periode","header":"Periode","type":"date","filter":"MMMM yyyy"}
	];
	$scope.Math = window.Math;
	$scope.sort = "nomor";
	$scope.reverse = true;
	$scope.load = function(){
		$scope.barangs = barangFactory.query();
		$scope.permintaanBarangs = permintaanBarangFactory.query();
		$scope.permintaanBarang = new permintaanBarangFactory({
			tanggal: new Date(),
			jenis: false,
			periode: new Date(),
			sppItemsList: new Array({
				tanggalButuh: new Date()
			})
		});
		$scope.items = $scope.permintaanBarangs;
	};
	$scope.create = function(){
		$scope.permintaanBarang.$save(function(){
			$scope.load();
			$scope.close();
		});
	};
	$scope.update = function(){
		$scope.permintaanBarang.$update(function(){
			$scope.load();
			$scope.close();
		});
	};
	$scope.delete = function(permintaanBarang) {
		var confirmDelete = $window.confirm('Apakah Anda Yakin?');
		if ( confirmDelete )
		{
			permintaanBarang.$delete(function(){
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
		$scope.permintaanBarang = new permintaanBarangFactory({
			tanggal: new Date(),
			jenis: false,
			periode: new Date(),
			sppItemsList: new Array({
				tanggalButuh: new Date()
			})
		});
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/permintaanBarang/views/form-permintaanBarang.views.html',
			size: 'lg',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openRead = function(permintaanBarang){
		$scope.close();
		$scope.permintaanBarang = angular.copy(permintaanBarang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/permintaanBarang/views/detail-permintaanBarang.views.html',
			size: 'lg',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.openUpdate = function(permintaanBarang){
		$scope.close();
		$scope.status = false;
		$scope.permintaanBarangOld = angular.copy(permintaanBarang);
		$scope.permintaanBarang = angular.copy(permintaanBarang);
		$scope.modalInstance = $modal.open({
			templateUrl: 'modules/permintaanBarang/views/form-permintaanBarang.views.html',
			size: 'lg',
			backdrop: 'static',
			scope: $scope
		});
	};
	$scope.log = function(){
		console.log("clicked");
	};
}]);
