angular.module("RadCalc.services").factory("edeCalculationService", function() {

    return {

        simpleEdeCalculation: function(singleEde, scanCount) {
            return singleEde * scanCount;
        },

        roundEdeToDecimalPlaces: function(unadjustedEDE, decimalPlaces) {
            return unadjustedEDE.toFixed(decimalPlaces);
        },

        countDecimalPlaces: function(value) {
            var valueString = "" + value;
            var ary = valueString.split(("."));
            if (ary.length < 2) {
                return 0;
            } else {
                return ary[1].length;
            }
        }

    };

});