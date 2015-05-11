angular.module("fyGrid", [])
    .directive("fyGrid", function() {
        return {
            restrict: "AE",
            templateUrl: "scripts/directives/fy-grid.html",
            controller: function($scope, $filter, $window, $modal, $q) {
                $scope.Math = window.Math;
                $scope.cart = [];
                $scope.page = {
                    current: 1,
                    expandedAll: false,
                    selectedAll: false
                };
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
                    if ($scope.module == "permintaanBarang") {
                        if (selected) {
                            angular.forEach(item.sppItemsList, function(itemBarang) {
                                itemBarang.selected = true;
                            });
                        } else {
                            angular.forEach(item.sppItemsList, function(itemBarang) {
                                itemBarang.selected = false;
                            });
                        }
                    }
                };
                $scope.uncheckAll = function() {
                    switch ($scope.module) {
                        case "katalogBarang":
                        case "waste":
                            angular.forEach($scope.items, function(item) {
                                item.selected = false;
                            });
                            break;
                        case "permintaanBarang":
                            angular.forEach($scope.items, function(item) {
                                angular.forEach(item.sppItemsList, function(itemBarang) {
                                    itemBarang.selected = false;
                                });
                            });
                            break;
                    }
                };
                $scope.detailCart = function() {
                    $scope.modalInstance = $modal.open({
                        templateUrl: "scripts/directives/fy-grid-cart.html",
                        size: "lg",
                        backdrop: "static",
                        scope: $scope
                    });
                    $scope.modalInstance.result.then({}, function(reason) {
                        switch (reason) {
                            case "createPermintaanBarang":
                                $scope.openCreatePermintaanBarang();
                                break;
                            case "createPesananBarang":
                                $scope.openCreatePesananBarang();
                                break;
                            case "createPenjualanWaste":
                                $scope.openCreatePenjualanWaste();
                                break;
                        }

                    });
                };
                $scope.clearCart = function() {
                    var confirm = $window.confirm("Apakah Anda Yakin?");
                    if (confirm) {
                        $scope.uncheckAll();
                    }
                    if (!!$scope.modalInstance) {
                        $scope.modalInstance.close();
                    }
                };
                $scope.deleteCartItem = function(cartItem) {
                    var cartLength = $scope.cart.length;
                    angular.forEach($scope.items, function(item) {
                        switch ($scope.module) {
                            case "katalogBarang":
                                if (item.kode == cartItem.barang.kode) {
                                    item.selected = false;
                                    cartLength--;
                                }
                                break;
                            case "permintaanBarang":
                                if (cartItem.spp == item.nomor) {
                                    angular.forEach(item.sppItemsList, function(itemBarang) {
                                        if (itemBarang.barang.kode == cartItem.barang.kode) {
                                            itemBarang.selected = false;
                                            cartLength--;
                                        }
                                    });
                                }
                                break;
                            case "waste":
                                if (item.kode == cartItem.kode) {
                                    item.selected = false;
                                    cartLength--;
                                }
                                break;
                        }
                    });
                    if (!cartLength) {
                        $scope.modalInstance.close();
                        console.log("true ", cartLength);
                    }
                };
                $scope.$watch("items", function() {
                    $scope.cart = [];
                    switch ($scope.module) {
                        case "katalogBarang":
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
                                        var newest = new Date("1945-08-17");
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
                                    $scope.cart.push({
                                        barang: barang,
                                        leadTime: leadTime,
                                        harga: harga
                                    });
                                }
                            });
                            break;
                        case "permintaanBarang":
                            angular.forEach($scope.items, function(item) {
                                if (item.status == "APPROVED") {
                                    angular.forEach(item.sppItemsList, function(itemBarang) {
                                        if (itemBarang.selected && itemBarang.status == "APPROVED") {
                                            $scope.cart.push({
                                                spp: item.nomor,
                                                barang: itemBarang.barang,
                                                qty: itemBarang.sisa,
                                                harga: itemBarang.harga,
                                                hargaKatalog: itemBarang.harga
                                            });
                                        }
                                    });
                                }
                            });
                            break;
                        case "waste":
                            angular.forEach($scope.items, function(item) {
                                if (item.selected) {
                                    $scope.cart.push({
                                        kode: item.kode,
                                        nama: item.nama,
                                        satuan: item.satuan
                                    });
                                }
                            });
                            break;
                    }
                }, true);
                $scope.$watchCollection("search", function() {
                    $scope.currentPage = 1;
                });
                $scope.$watchCollection("displayed", function() {
                    if ($scope.page.selectedAll) {
                        $scope.page.selectedAll = false;
                    }
                });
                $scope.$watch("displayed", function() {
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
                $scope.$watch("page.expandedAll", function() {
                    angular.forEach($scope.displayed, function(item) {
                        if ($scope.page.expandedAll) {
                            item.expanded = true;
                        } else {
                            item.expanded = false;
                        }
                    });
                });
                $scope.$watchCollection("cart", function() {
                    switch ($scope.module) {
                        case "katalogBarang":
                            localStorage.setItem("katalogBarang", JSON.stringify({
                                kategori: $scope.search.kategori
                            }));
                            localStorage.setItem("katalogBarangCart", JSON.stringify($scope.cart));
                            break;
                        case "permintaanBarang":
                            localStorage.setItem("permintaanBarang", JSON.stringify({
                                kategori: $scope.search.kategori
                            }));
                            localStorage.setItem("permintaanBarangCart", JSON.stringify($scope.cart));
                            break;
                        case "waste":
                            localStorage.setItem("wasteCart", JSON.stringify($scope.cart));
                            break;
                    }
                });
            }
        };
    })
    .filter("startFrom", function() {
        return function(input, start) {
            start = +start;
            if (!!input) return input.slice(start);
        };
    })
    .filter("periodeFilter", function() {
        return function(input) {
            if (!!input) {
                var splitted = input.split("-");
                var date = new Date(splitted[1], splitted[0] - 1, 15, 0, 0, 0, 0);
                return date;
            }
        };
    });