angular.module("RadCalc").directive("twoDecimals", [function () {
  
    countDecimalPlaces = function(s) {
        var len = s.length;
        var pos = s.indexOf(".") + 1;
        if (pos === 0 ) { return 0; }
        return len - pos;
    };
  
    formatForView = function(n) {
        // convert to string
        var s = "" + n;
    
        var decimalPlaces = countDecimalPlaces(s);
    
        // already has two decimal places
        if (decimalPlaces === 2) { return s; }
    
        // round if already more than 2 decimal places
        if (decimalPlaces > 2) {
            return "" + Math.round10(n, -2);
        }
    
        // has no decimal places, add a dot
        if (decimalPlaces === 0) {
            s = addDot(s);
        }
    
        // fill with zeros to 2 places
        while(countDecimalPlaces(s) < 2) {
            s = addZero(s);
        }
    
        return s;
    };
  
    addDot = function(s) {
        return s + ".";
    };
  
    addZero = function(s) {
        return s + "0";
    };
  
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
      
            var toView = function (val) {
                return formatForView(val);
            };
      
            ngModel.$formatters.unshift(toView);
        }
    };
}]);