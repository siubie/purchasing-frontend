angular.module('barang.filters', [])
.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});