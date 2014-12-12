angular.module("RadCalc").directive("xrayTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-xray-table-header.html"
    };
});