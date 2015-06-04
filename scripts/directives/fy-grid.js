angular.module("fyGrid", [])
    .directive("fyGrid", function() {
        return {
            restrict: "AE",
            templateUrl: "scripts/directives/fy-grid.html",
            controller: function($filter, $modal, $scope, $window) {
                $scope.Math = window.Math;
                $scope.page = {
                    current: 1,
                };
                $scope.$watchCollection("search", function() {
                    $scope.currentPage = 1;
                });
            }
        };
    })
    .filter("startFrom", function() {
        return function(input, start) {
            start = +start;
            if (!!input) return input.slice(start);
        };
    });
