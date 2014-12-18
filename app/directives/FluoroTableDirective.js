angular.module("RadCalc").directive("fluoroTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-fluoro-table-header.html"
    };
});