window.decimalFormatter = (function () {
    function DecimalFormatter (els) {
         //
    }

    var decimalFormatter;

    countDecimalPlaces = function(s) {
        var len = s.length;
        var pos = s.indexOf(".") + 1;
        if (pos === 0 ) { return 0; }
        return len - pos;
    };
    
    formatForView = function(n, d) {
        // convert to string
        var s = "" + n;
    
        var decimalPlaces = countDecimalPlaces(s);
    
        // already has two decimal places
        if (decimalPlaces === d) { return s; }
    
        // round if already more than d decimal places
        if (decimalPlaces > d) {
            return "" + Math.round10(n, -d);
        }
    
        // has no decimal places, add a dot
        if (decimalPlaces === 0) {
            s = addDot(s);
            // make sure there is a leading number
            if (s === ".") {
                s = "0.";
            }
        }
    
        // fill with zeros to d places
        while(countDecimalPlaces(s) < d) {
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
     
    decimalFormatter = {
        format: function (value, decimalPlaces) {
            return formatForView(value, decimalPlaces);
        }
    };
     
    return decimalFormatter;
}());