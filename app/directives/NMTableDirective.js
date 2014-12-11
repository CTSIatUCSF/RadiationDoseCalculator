angular.module("RadCalc").directive("nmTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-nm-table-header.html"
    };
});