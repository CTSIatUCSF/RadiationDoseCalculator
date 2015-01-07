angular.module("RadCalc").directive("greaterThanZero", function() {

    var link = function($scope, $element, $attrs, ctrl) {

      var validate = function(viewValue) {
        // var comparisonModel = $attrs.lowerThan;
        
        // if(!viewValue || !comparisonModel){
        //   // It's valid because we have nothing to compare against
        //   ctrl.$setValidity('lowerThan', true);
        // }

        // It's valid if model is lower than the model we're comparing against
        ctrl.$setValidity('greaterThanZero', parseFloat(viewValue, 10) > 0 );
        return viewValue;
      };

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.push(validate);

      $attrs.$observe('greaterThanZero', function(comparisonModel){
        return validate(ctrl.$viewValue);
      });
      
    };

    return {
      require: 'ngModel',
      link: link
    };
});