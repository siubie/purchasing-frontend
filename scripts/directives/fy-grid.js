angular.module('fyGrid', [])
    .directive('fyGrid', function() {
        return {
            restrict: 'AE',
            templateUrl: 'scripts/directives/fy-grid.html',
            controller: function($scope, $filter, $window) {
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