angular.module("RadCalc").directive("ctTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-ct-table-header.html"
    };
});