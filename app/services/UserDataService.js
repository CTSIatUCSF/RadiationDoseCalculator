angular.module("RadCalc.services").factory("UserDataService", function($q, $http) {

    // Private
    var userData = { "formData": []};
    var doesExist, edeTotal, getFormData, maxDecimalPlaces, countDecimalPlaces, getScanCount;

    doesExist = function(formId) {
        var index, item;
        for (index in userData.formData) {
            item = userData.formData[index];
            if (item.id === formId) { return true; }
        }
        return false;
    };

    edeTotal = function(onlySOC, formId) {
        var decimalPlaceCount = 0;
        var total = 0;
        if (doesExist(formId)) {
            var formData = getFormData(formId);
            angular.forEach(formData.exams, function(item) {
                if (item.soc === onlySOC) {
                    decimalPlaceCount = -maxDecimalPlaces(total, item.ede);
                    total += item.ede;
                }
            });
        }
        return Math.round10(total, decimalPlaceCount);
    };

    getFormData = function(formId) {
        var index, item;
        for (index in userData.formData) {
            item = userData.formData[index];
            if (item.id === formId) { return item; }
        }
        return null;
    };

    maxDecimalPlaces = function(n1, n2) {
        var n1Count = countDecimalPlaces(n1);
        var n2Count = countDecimalPlaces(n2);
        if (n1Count > n2Count) {
            return n1Count;
        }
        return n2Count;
    };

    countDecimalPlaces = function(value) {
        var valueString = "" + value;
        var ary = valueString.split(("."));
        if (ary.length < 2) {
            return 0;
        } else {
            return ary[1].length;
        }
    };

    getScanCount = function(formId) {
        var count = 0;
        if (doesExist(formId)) {
            var formData = getFormData(formId);
            angular.forEach(formData.exams, function(item) {
                if (item.exam !== "") {
                    count += item.scans;
                }
            });
        }
        return count;
    };

  return {
    // Public

    // Getters
    getScanCount: getScanCount,
    getFormData: getFormData,

    userData: function() {
        return userData;
    },

    // Setters
    updateFormData: function(formData) {
        if (doesExist(formData.id) === false) {
            userData.formData.push(formData);
            return;
        }

        var oldFormData = userData.formData;
        userData.formData = [];
        angular.forEach(oldFormData, function(item) {
            if (item.exam !== "") {
                if (item.id === formData.id) {
                    userData.formData.push(formData);
                } else {
                    userData.formData.push(item);
                }
            }
        });
    },

    updateSupplementalConsentText: function(supplementalConsentText) {
        userData.supplementalConsentText = supplementalConsentText;
    },

    // Basic Calculations
    countDecimalPlaces:countDecimalPlaces,

    simpleEdeCalculation: function(singleEde, scanCount) {
        return singleEde * scanCount;
    },

    // Section Totals

    /*
    formId = identifies which section of the report to return data for.
        Should correspond to the id value on a form controller. (ex: CT)

    Returns total EDE for a section of the report, regardless of Standard of Care value
    */
    edeTotal: function(formId) {
        var onlySOC = this.edeTotalOnlySOC(formId);
        var withoutSOC = this.edeTotalWithoutSOC(formId);
        var totalSOC = onlySOC + withoutSOC;
        var decimalPlaceCount = -maxDecimalPlaces(onlySOC, withoutSOC);
        return Math.round10(totalSOC, decimalPlaceCount);
    },

    /*
    formId = Identifies which section of the report to return data for.
        Should correspond to the id value on a form controller. (ex: CT)

    Returns total EDE for a section of the report, excluding items marked as Standard of Care
    */
    edeTotalWithoutSOC: function(formId) {
        return edeTotal(false, formId);
    },

    /*
    formId = identifies which section of the report to return data for.
        Should correspond to the id value on a form controller. (ex: CT)

    Returns total EDE for a section of the report, excluding items that are not marked as Standard of Care
    */
    edeTotalOnlySOC: function(formId) {
        return edeTotal(true, formId);
    },

    // Report Totals 

    /*
    Returns total EDE for the entire report, regardless of Standard of Care value
    */
    edeReportTotal: function() {
        var formIndex, form, ede;
        var total = 0;
        var decimalPlaceCount = 0;
        if (userData) {
            for (formIndex in userData.formData) {
                form = userData.formData[formIndex];
                ede = this.edeTotal(form.id);
                decimalPlaceCount = maxDecimalPlaces(total, ede);
                total += ede;
                total = Math.round10(total, -decimalPlaceCount);
            }
        }
        return total;
    },

    /*
    Returns total EDE for the entire report, excluding items marked as Standard of Care
    */
    edeReportTotalWithoutSOC: function() {
        var formIndex, form, ede;
        var total = 0;
        var decimalPlaceCount = 0;
        if (userData) {
            for (formIndex in userData.formData) {
                form = userData.formData[formIndex];
                ede = this.edeTotalWithoutSOC(form.id);
                decimalPlaceCount = maxDecimalPlaces(total, ede);
                total += ede;
                total = Math.round10(total, -decimalPlaceCount);
            }
        }
        return total;
    },

    /*
    Returns total EDE for the entire report, excluding items that are not marked as Standard of Care
    */
    edeReportTotalOnlySOC: function() {
        var formIndex, form, ede;
        var total = 0;
        var decimalPlaceCount = 0;
        if (userData) {
            for (formIndex in userData.formData) {
                form = userData.formData[formIndex];
                ede = this.edeTotalOnlySOC(form.id);
                decimalPlaceCount = maxDecimalPlaces(total, ede);
                total += ede;
                total = Math.round10(total, -decimalPlaceCount);
            }
        }
        return total;
    }

  };
});