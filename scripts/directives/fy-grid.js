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
                if ($scope.module == "katalogBarang") {
                    $scope.detailFields = [{
                        "name": "barang.kode",
                        "type": "string",
                        "header": "Kode"
                    }, {
                        "name": "barang.kategori",
                        "type": "string",
                        "header": "Kategori"
                    }, {
                        "name": "barang.nama",
                        "type": "string",
                        "header": "Nama Barang"
                    }, {
                        "name": "barang.satuan",
                        "type": "string",
                        "header": "Satuan",
                    }];
                    if (!!localStorage.katalogBarangCart) {
                        $scope.cart = JSON.parse(localStorage.katalogBarangCart);
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
                if ($scope.module == "waste") {
                    $scope.detailFields = [{
                        "name": "kode",
                        "type": "string",
                        "header": "Kode Waste"
                    }, {
                        "name": "nama",
                        "type": "string",
                        "header": "Nama Waste"
                    }, {
                        "name": "satuan",
                        "type": "String",
                        "header": "Satuan",
                    }];
                    if (!!localStorage.wasteCart) {
                        $scope.cart = JSON.parse(localStorage.wasteCart);
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
                    angular.forEach($scope.items, function(item) {
                        item.selected = false;
                    });
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
                            if ($scope.module == "katalogBarang") {
                                delete itemSelected.selected;
                                if (!!$scope.cart.length) {
                                    angular.forEach($scope.cart, function(itemCart) {
                                        if (itemCart.barang.kode == itemSelected.kode) {
                                            duplicated = true;
                                        }
                                    });
                                    if (!duplicated) {
                                        $scope.cart.push(itemSelected);
                                    }
                                } else {
                                    $scope.cart.push(itemSelected);
                                }
                                localStorage.setItem("katalogBarangCart", JSON.stringify($scope.cart));
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
                            if ($scope.module == "waste") {
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
                                localStorage.setItem("wasteCart", JSON.stringify($scope.cart));
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
                    var confirm = $window.confirm('Apakah Anda Yakin?');
                    if (confirm) {
                        $scope.cart = [];
                        if ($scope.module == "katalogBarang") localStorage.setItem("katalogBarangCart", "");
                        if ($scope.module == "permintaanBarang") localStorage.setItem("permintaanBarangCart", "");
                        if ($scope.module == "waste") localStorage.setItem("wasteCart", "");
                        if (!$scope.cart.length) {
                            $scope.close();
                        }
                    }
                };
                $scope.deleteCartItem = function(data) {
                    var confirm = $window.confirm('Apakah Anda Yakin?');
                    if (confirm) {
                        angular.forEach($scope.cart, function(item, i) {
                            if (item == data) {
                                $scope.cart.splice(i, 1);
                            }
                        });
                        if (!$scope.cart.length) {
                            $scope.close();
                        }
                    }
                };
                $scope.$watch("items", function() {
                    $scope.selected = [];
                    if ($scope.module == "katalogBarang") {
                        angular.forEach($scope.items, function(item) {
                            if (item.selected) {
                                var barang = new Object({
                                    kode: item.kode,
                                    kategori: item.kategori,
                                    nama: item.nama,
                                    satuan: item.satuan,
                                    spesifikasi: item.spesifikasi,
                                    deskripsi: item.deskripsi
                                });
                                var harga = 0;
                                var leadTime = 30;
                                if (!!item.katalogLength) {
                                    var newest = new Date('1945-08-17');
                                    var longest = 0;
                                    angular.forEach($scope.katalogBarangs, function(katalogBarang) {
                                        if (katalogBarang.barang.kode == item.kode) {
                                            if (katalogBarang.leadTime > longest) {
                                                leadTime = katalogBarang.leadTime;
                                                longest = katalogBarang.leadTime;
                                            }
                                            angular.forEach(katalogBarang.historyHarga, function(itemHarga) {
                                                itemHarga.tanggal = new Date(itemHarga.tanggal);
                                                if (itemHarga.tanggal > newest) {
                                                    harga = itemHarga.harga;
                                                    newest = itemHarga.tanggal;
                                                }
                                                if (itemHarga.tanggal == newest && itemHarga.harga > harga) {
                                                    harga = itemHarga;
                                                }
                                            });
                                        }
                                    });

                                }
                                $scope.selected.push({
                                    barang: barang,
                                    leadTime: leadTime,
                                    harga: harga
                                });
                                // console.log($scope.selected);
                            }
                        });
                    }
                    if ($scope.module == "permintaanBarang") {
                        angular.forEach($scope.items, function(item) {
                            if (item.status == "APPROVED") {
                                angular.forEach(item.sppItemsList, function(detail) {
                                    if (detail.selected) {
                                        $scope.selected.push({
                                            spp: item.nomor,
                                            barang: detail.barang,
                                            qty: detail.jumlah,
                                            harga: detail.harga
                                        });
                                    }
                                });
                            }
                        });
                    }
                    if ($scope.module == "waste") {
                        angular.forEach($scope.items, function(item) {
                            if (item.selected) {
                                $scope.selected.push({
                                    kode: item.kode,
                                    nama: item.nama,
                                    satuan: item.satuan
                                });
                            }
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
                    if ($scope.module == "waste" && !!$scope.cart.length) {
                        localStorage.setItem("wasteCart", JSON.stringify($scope.cart));
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
            if (!!input) return input.slice(start);
        };
    })
    .filter('periodeFilter', function() {
        return function(input) {
            var splitted = input.split("-");
            var date = new Date(splitted[1], splitted[0] - 1, 15, 0, 0, 0, 0);
            return date;
        };
    });