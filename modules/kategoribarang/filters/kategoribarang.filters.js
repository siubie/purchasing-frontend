'use strict';

angular.module('kategoriBarangFilters', [])
.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});
