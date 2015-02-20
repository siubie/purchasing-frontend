angular.module('fyGrid', [])
    .directive('fyGrid', function() {
        return {
            restrict: 'AE',
            templateUrl: 'scripts/directives/fy-grid.html',
            controller: function($scope, $filter, $window, $modal) {
                $scope.cart = [];
                if ($scope.module == "barang" && !!localStorage.barangCart) {
                    $scope.cart = JSON.parse(localStorage.barangCart);
                }
                if ($scope.module == "permintaanBarang" && !!localStorage.permintaanBarangCart) {
                    $scope.cart = JSON.parse(localStorage.permintaanBarangCart);
                }
                $scope.checkDisplayed = function() {
                    angular.forEach($scope.displayed, function(item) {
                        item.selected = $scope.selectedAll;
                    });
                };
                $scope.uncheckDisplayed = function(selected) {
                    if (!selected) {
                        $scope.selectedAll = false;
                    }
                };
                $scope.uncheckAll = function() {
                    angular.forEach($scope.selected, function(item) {
                        item.selected = false;
                    });
                };
                $scope.deleteSelected = function() {
                    var confirmDelete = $window.confirm('Apakah Anda Yakin?');
                    if (confirmDelete) {
                        var spliceSelected = function(i) {
                            $scope.items.splice(i, 1);
                        };
                        var i = $scope.selected.length;
                        while (i--) {
                            if ($scope.selected[i].selected) {
                                $scope.selected[i].$delete(spliceSelected(i));
                            }
                        }
                    }
                };
                $scope.close = function() {
                    if ($scope.modalInstance) {
                        $scope.modalInstance.close();
                        console.log("modal closed!!!");
                    }
                };
                $scope.addToCart = function() {
                    if (typeof(Storage) != "undefined") {
                        angular.forEach($scope.selected, function(itemSelected) {
                            var duplicated = false;
                            delete itemSelected.selected;
                            if (!!$scope.cart.length) {
                                angular.forEach($scope.cart, function(itemCart) {
                                    if (itemCart.kode == itemSelected.kode) {
                                        duplicated = true;
                                    }
                                });
                                if (!duplicated) {
                                    $scope.cart.push(itemSelected);
                                }
                            } else {
                                $scope.cart.push(itemSelected);
                            }
                            if ($scope.module == "barang") {
                                localStorage.setItem("barangCart", JSON.stringify($scope.cart));
                            }
                            if ($scope.module == "permintaanBarang") {
                                localStorage.setItem("permintaanBarangCart", JSON.stringify($scope.cart));
                            }
                        });
                    }
                };
                $scope.detailCart = function() {
                    $scope.close();
                    $scope.modalInstance = $modal.open({
                        templateUrl: 'scripts/directives/fy-grid-cart.html',
                        size: 'lg',
                        backdrop: 'static',
                        scope: $scope
                    });
                };
                $scope.clearCart = function() {
                    var confirmDelete = $window.confirm('Apakah Anda Yakin?');
                    if (confirmDelete) {
                        $scope.cart = [];
                        localStorage.setItem("barangCart", "");
                        if (!$scope.cart.length) {
                            $scope.close();
                        }
                    }
                };
                $scope.deleteCartItem = function(data) {
                    angular.forEach($scope.cart, function(item, i) {
                        if (item == data) {
                            $scope.cart.splice(i, 1);
                        }
                    });
                    if (!$scope.cart.length) {
                        $scope.close();
                    }
                };
                $scope.$watch('items', function() {
                    $scope.selected = $filter('filter')($scope.items, {
                        selected: 'true'
                    });
                }, true);
                $scope.$watchCollection('search', function() {
                    $scope.currentPage = 1;
                });
                $scope.$watchCollection('displayed', function() {
                    if ($scope.selectedAll) {
                        $scope.selectedAll = false;
                    }
                });
                $scope.$watch('displayed', function() {
                    $scope.selectedAll = true;
                    angular.forEach($scope.displayed, function(item) {
                        if (!item.selected) {
                            $scope.selectedAll = false;
                        }
                    });
                }, true);
                $scope.$watch('expandedAll', function() {
                    angular.forEach($scope.displayed, function(item) {
                        if ($scope.expandedAll) {
                            item.expanded = true;
                        } else {
                            item.expanded = false;
                        }
                    });
                });
                $scope.$watchCollection('cart', function() {
                    if ($scope.module == "barang" && !!$scope.cart.length) {
                        localStorage.setItem("barangCart", JSON.stringify($scope.cart));
                    }
                    if ($scope.module == "permintaanBarang" && !!$scope.cart.length) {
                        localStorage.setItem("permintaanBarangCart", JSON.stringify($scope.cart));
                    }
                });
                $scope.log = function(log) {
                    console.log(log);
                };
            }
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start;
            return input.slice(start);
        };
    })
    .filter('periodeFilter', function() {
        return function(input) {
            var splitted = input.split("-");
            var date = new Date(splitted[1], splitted[0] - 1, 15, 0, 0, 0, 0);
            return date;
        };
    });