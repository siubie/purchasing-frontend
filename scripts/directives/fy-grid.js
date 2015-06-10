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
    .directive('capitalize', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if (inputValue === undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                };
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    })
    .filter("startFrom", function() {
        return function(input, start) {
            start = +start;
            if (!!input) return input.slice(start);
        };
    });