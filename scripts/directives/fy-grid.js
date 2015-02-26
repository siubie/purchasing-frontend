angular.module('fyGrid', [])
    .directive('fyGrid', function() {
        return {
            restrict: 'AE',
            templateUrl: 'scripts/directives/fy-grid.html',
            controller: function($scope, $filter, $window, $modal) {
                $scope.cart = [];
                $scope.page = {
                    current: 1,
                    expandedAll: false,
                    selectedAll: false
                };
                $scope.search = [];
                if ($scope.module == "barang") {
                    $scope.detailFields = [{
                        "name": "kode",
                        "type": "string",
                        "header": "Kode"
                    }, {
                        "name": "kategori",
                        "type": "string",
                        "header": "kategori"
                    }, {
                        "name": "nama",
                        "type": "string",
                        "header": "Nama"
                    }, {
                        "name": "alias",
                        "type": "string",
                        "header": "Alias"
                    }, {
                        "name": "satuan",
                        "type": "string",
                        "header": "Satuan"
                    }, {
                        "name": "spesifikasi",
                        "type": "string",
                        "header": "Spesifikasi",
                    }];
                    if (!!localStorage.barangCart) {
                        $scope.cart = JSON.parse(localStorage.barangCart);
                    }
                }
                if ($scope.module == "permintaanBarang") {
                    $scope.detailFields = [{
                        "name": "spp",
                        "type": "string",
                        "header": "Nomor SPP"
                    }, {
                        "name": "barang.kode",
                        "type": "string",
                        "header": "Kode Barang"
                    }, {
                        "name": "barang.nama",
                        "type": "string",
                        "header": "Nama Barang"
                    }, {
                        "name": "qty",
                        "type": "String",
                        "header": "Jumlah SPP",
                    }];
                    if (!!localStorage.permintaanBarangCart) {
                        $scope.cart = JSON.parse(localStorage.permintaanBarangCart);
                    }
                }
                if ($scope.module == "pesananBarang") {
                    if (!!localStorage.pesananBarangCart) {
                        $scope.cart = JSON.parse(localStorage.pesananBarangCart);
                    }
                }
                $scope.checkDisplayed = function() {
                    angular.forEach($scope.displayed, function(item) {
                        item.selected = $scope.page.selectedAll;
                        if ($scope.module == "permintaanBarang") {
                            angular.forEach(item.sppItemsList, function(detail) {
                                detail.selected = $scope.page.selectedAll;
                            });
                        }
                    });
                };
                $scope.checkItem = function(selected, item) {
                    if (!selected) {
                        $scope.page.selectedAll = false;
                    }
                    angular.forEach(item.sppItemsList, function(detail) {
                        detail.selected = selected;
                    });
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
                        // console.log("modal closed!!!");
                    }
                };
                $scope.addToCart = function() {
                    if (typeof(Storage) != "undefined") {
                        angular.forEach($scope.selected, function(itemSelected) {
                            var duplicated = false;
                            if ($scope.module == "barang") {
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
                                localStorage.setItem("barangCart", JSON.stringify($scope.cart));
                            }
                            if ($scope.module == "permintaanBarang") {
                                if (!!$scope.cart.length) {
                                    angular.forEach($scope.cart, function(itemCart) {
                                        if ((itemCart.barang.kode == itemSelected.barang.kode) && (itemCart.spp == itemSelected.spp)) {
                                            duplicated = true;
                                        }
                                    });
                                    if (!duplicated) {
                                        $scope.cart.push(itemSelected);
                                    }
                                } else {
                                    $scope.cart.push(itemSelected);
                                }
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
                        if ($scope.module == "barang") localStorage.setItem("barangCart", "");
                        if ($scope.module == "permintaanBarang") localStorage.setItem("permintaanBarangCart", "");
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
                $scope.$watch("items", function() {
                    if ($scope.module == "barang") {
                        $scope.selected = $filter('filter')($scope.items, {
                            selected: 'true'
                        });
                    }
                    if ($scope.module == "permintaanBarang") {
                        $scope.selected = [];
                        angular.forEach($scope.items, function(item) {
                            angular.forEach(item.sppItemsList, function(detail) {
                                if (detail.selected) {
                                    $scope.selected.push({
                                        spp: item.nomor,
                                        barang: detail.barang,
                                        qty: detail.jumlah
                                    });
                                }
                            });
                        });
                    }
                }, true);
                $scope.$watchCollection('search', function() {
                    $scope.currentPage = 1;
                });
                $scope.$watchCollection('displayed', function() {
                    if ($scope.page.selectedAll) {
                        $scope.page.selectedAll = false;
                    }
                });
                $scope.$watch('displayed', function() {
                    $scope.page.selectedAll = true;
                    angular.forEach($scope.displayed, function(item) {
                        if (!item.selected) {
                            $scope.page.selectedAll = false;
                        }
                        if ($scope.module == "permintaanBarang") {
                            item.selected = true;
                            angular.forEach(item.sppItemsList, function(detail) {
                                if (!detail.selected) {
                                    item.selected = false;
                                }
                            });
                        }
                    });
                }, true);
                $scope.$watch('page.expandedAll', function() {
                    angular.forEach($scope.displayed, function(item) {
                        if ($scope.page.expandedAll) {
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