angular.module("RadCalc").directive("twoDecimals", [function () {
  
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
      
            var toView = function (value) {
                return decimalFormatter.format(value, 2);
            };
      
            ngModel.$formatters.unshift(toView);
        }
    };
}]);