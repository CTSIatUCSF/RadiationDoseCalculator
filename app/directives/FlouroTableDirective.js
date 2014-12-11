angular.module("RadCalc").directive("flouroTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-flouro-table-header.html"
    };
});