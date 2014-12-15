angular.module("RadCalc").filter("twoDecimalsFilter", function () {

    return function (value) {
        return decimalFormatter.format(value, 2);
    };
});