angular.module("RadCalc.services").factory("UserDataService", function($q, $http) {

  var userData = { "formData": []};
  var doesExist, edeTotal;

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
      var formData = getFormData(formId);
      angular.forEach(formData.exams, function(item) {
          if (item.soc === onlySOC) {
              decimalPlaceCount = -maxDecimalPlaces(total, item.ede);
              total += item.ede;
          }
      });
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

    getFormData: getFormData,
    countDecimalPlaces:countDecimalPlaces,
    getScanCount: getScanCount,

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

    userData: function() {
      return userData;
    },

    simpleEdeCalculation: function(singleEde, scanCount) {
        return singleEde * scanCount;
    },

    edeTotal: function(formId) {
        var onlySOC = this.edeTotalOnlySOC(formId);
        var withoutSOC = this.edeTotalWithoutSOC(formId);
        var totalSOC = onlySOC + withoutSOC;
        var decimalPlaceCount = -maxDecimalPlaces(onlySOC, withoutSOC);
        return Math.round10(totalSOC, decimalPlaceCount);
    },

    edeTotalWithoutSOC: function(formId) {
        return edeTotal(false, formId);
    },

    edeTotalOnlySOC: function(formId) {
        return edeTotal(true, formId);
    },

    edeReportTotal: function() {
      var formIndex, form;
      var total = 0;
      var decimalPlaceCount = 0;
      for (formIndex in userData.formData) {
        form = userData.formData[formIndex];
        total += this.edeTotal(form.id);
        decimalPlaceCount = -maxDecimalPlaces(total, form.ede);
      }
      console.log("decimalPlaceCount = " + decimalPlaceCount);
      return Math.round10(total, decimalPlaceCount);
    },

    edeReportTotalOnlySOC: function() {
      var formIndex, form;
      var total = 0;
      var decimalPlaceCount = 0;
      for (formIndex in userData.formData) {
        form = userData.formData[formIndex];
        total += this.edeTotalOnlySOC(form.id);
        decimalPlaceCount = -maxDecimalPlaces(total, form.ede);
      }
      console.log("decimalPlaceCount = " + decimalPlaceCount);
      return Math.round10(total, decimalPlaceCount);
    },

    edeReportTotalWithoutSOC: function() {
      var formIndex, form;
      var total = 0;
      var decimalPlaceCount = 0;
      for (formIndex in userData.formData) {
        form = userData.formData[formIndex];
        total += this.edeTotalWithoutSOC(form.id);
        decimalPlaceCount = -maxDecimalPlaces(total, form.ede);
      }
      console.log("decimalPlaceCount = " + decimalPlaceCount);
      return Math.round10(total, decimalPlaceCount);
    }

  };
});