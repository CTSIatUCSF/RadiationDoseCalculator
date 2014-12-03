angular.module("RadCalc.services").factory("edeCalculationService", function() {

    return {

        simpleEdeCalculation: function(singleEde, scanCount) {
            return singleEde * scanCount;
        },

        countDecimalPlaces: function(value) {
            var valueString = "" + value;
            var ary = valueString.split(("."));
            if (ary.length < 2) {
                return 0;
            } else {
                return ary[1].length;
            }
        },

        maxDecimalPlaces: function(n1, n2) {
            var n1Count = this.countDecimalPlaces(n1);
            var n2Count = this.countDecimalPlaces(n2);
            if (n1Count > n2Count) {
                return n1Count;
            }
            return n2Count;
        }

    };

});