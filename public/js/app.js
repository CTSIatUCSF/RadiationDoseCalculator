angular.module("RadCalc.controllers", []);
angular.module("RadCalc.services", []);
angular.module("RadCalc.directives", []);

var app = angular.module("RadCalc", [
  "RadCalc.services",
  "RadCalc.controllers"
]);;angular.module("RadCalc.controllers").controller("CTFormCtrl", function($scope, getDataService, edeCalculationService) {

    var uniqueProcedureId = 0;

    $scope.form = {
      id: "CT",
      name: "X-ray Computed Tomography Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
      exams:[ defaultTomographyExam() ]
    };

    $scope.allProcedures = function(categoryId) {
        return getDataService.getAllProcedures(categoryId);
    };
    
    $scope.createRow = function () {
        $scope.form.exams.push( defaultTomographyExam() );
    };
    
    $scope.submit = function(){
        console.log($scope.form.exams);
    };

    $scope.socLabel = function(value) {
        if (value) { return "Yes"; }
        return "No";
    };

    $scope.calculateEDE = function(exam) {
        if (exam.exam === "" || exam.exam === undefined) { return 0; }

        // Adjust the ede value to reflect level of precision and avoid floating point rounding errors
        var singleScanEDE = getDataService.getProcedurePropertyValue($scope.form.id, exam.exam, exam.gender);
        var unadjustedEDE = edeCalculationService.simpleEdeCalculation(singleScanEDE, exam.scans);
        var decimalPlaces = edeCalculationService.countDecimalPlaces(singleScanEDE);
        var adjustedEDE   = Math.round10(unadjustedEDE, -decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    $scope.removeProcedure = function(procedureId) {
        var i, procedure;
        console.log(procedureId);
        for (i=0; i<$scope.form.exams.length; i++) {
            procedure = $scope.form.exams[i];
            if (procedureId === procedure.id) {
                $scope.form.exams.splice(i, 1);
                return;
            }
        }
    };

    $scope.edeTotal = function() {
        return edeTotal(true);
    };

    $scope.edeTotalWithoutSOC = function() {
        return edeTotal(false);
    };

    function edeTotal(includeSOC) {
        var decimalPlaceCount = 0;
        var total = 0;
        if (includeSOC === true) {
            angular.forEach($scope.form.exams, function(item) {
                decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                total += item.ede;
            });
        } else {
            angular.forEach($scope.form.exams, function(item) {
                if (!item.soc) {
                    decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                    total += item.ede;
                }
            });
        }
        return Math.round10(total, decimalPlaceCount);
    }

    function defaultTomographyExam() {
        uniqueProcedureId++;
        return { id: uniqueProcedureId, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
    }

});;angular.module("RadCalc.controllers").controller("CommonFormCtrl", function($scope, getDataService) {

    $scope.testVariable = "This is my test variable!";

});;angular.module("RadCalc.controllers").controller("FlouroscopyFormCtrl", function($scope, getDataService, edeCalculationService) {

    var uniqueProcedureId = 0;

    $scope.form = {
      id: "Flouro",
      name: "Flouroscopy Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Minutes", "EDE(mSv)"],
      exams:[ defaultTomographyExam() ]
    };

    $scope.allProcedures = function(categoryId) {
        return getDataService.getAllProcedures(categoryId);
    };
    
    $scope.createRow = function () {
        $scope.form.exams.push( defaultTomographyExam() );
    };
    
    $scope.submit = function(){
        console.log($scope.form.exams);
    };

    $scope.socLabel = function(value) {
        if (value) { return "Yes"; }
        return "No";
    };

    $scope.calculateEDE = function(exam) {
        if (exam.exam === "" || exam.exam === undefined) { return 0; }

        // Adjust the ede value to reflect level of precision and avoid floating point rounding errors
        var singleScanEDE = getDataService.getProcedurePropertyValue($scope.form.id, exam.exam, exam.gender);
        var unadjustedEDE = edeCalculationService.simpleEdeCalculation(singleScanEDE, exam.scans);
        unadjustedEDE = unadjustedEDE * exam.minutes;
        var decimalPlaces = edeCalculationService.countDecimalPlaces(singleScanEDE);
        var adjustedEDE   = Math.round10(unadjustedEDE, -decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    $scope.removeProcedure = function(procedureId) {
        var i, procedure;
        console.log(procedureId);
        for (i=0; i<$scope.form.exams.length; i++) {
            procedure = $scope.form.exams[i];
            if (procedureId === procedure.id) {
                $scope.form.exams.splice(i, 1);
                return;
            }
        }
    };

    $scope.edeTotal = function() {
        return edeTotal(true);
    };

    $scope.edeTotalWithoutSOC = function() {
        return edeTotal(false);
    };

    function edeTotal(includeSOC) {
        var decimalPlaceCount = 0;
        var total = 0;
        if (includeSOC === true) {
            angular.forEach($scope.form.exams, function(item) {
                decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                total += item.ede;
            });
        } else {
            angular.forEach($scope.form.exams, function(item) {
                if (!item.soc) {
                    decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                    total += item.ede;
                }
            });
        }
        return Math.round10(total, decimalPlaceCount);
    }

    function defaultTomographyExam() {
        uniqueProcedureId++;
        return { id: uniqueProcedureId, exam: "", scans: 0, soc: false, gender: "mixed", minutes: 0, ede: 0 };
    }

});;angular.module("RadCalc.controllers").controller("NMFormCtrl", function($scope, getDataService, edeCalculationService) {

    var uniqueProcedureId = 0;

    $scope.form = {
      id: "NM",
      name: "Nuclear Medicine Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "InjectedDose (mCi)", "EDE(mSv)"],
      exams:[ defaultTomographyExam() ]
    };

    $scope.allProcedures = function(categoryId) {
        return getDataService.getAllProcedures(categoryId);
    };
    
    $scope.createRow = function () {
        $scope.form.exams.push( defaultTomographyExam() );
    };
    
    $scope.submit = function(){
        console.log($scope.form.exams);
    };

    $scope.socLabel = function(value) {
        if (value) { return "Yes"; }
        return "No";
    };

    $scope.calculateEDE = function(exam) {
        if (exam.exam === "" || exam.exam === undefined) { return 0; }

        // Adjust the ede value to reflect level of precision and avoid floating point rounding errors
        var singleScanEDE = getDataService.getProcedurePropertyValue($scope.form.id, exam.exam, exam.gender);
        var unadjustedEDE = edeCalculationService.simpleEdeCalculation(singleScanEDE, exam.scans);
        unadjustedEDE = unadjustedEDE * exam.injectedDose;
        var decimalPlaces = edeCalculationService.countDecimalPlaces(singleScanEDE);
        var adjustedEDE   = Math.round10(unadjustedEDE, -decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    $scope.removeProcedure = function(procedureId) {
        var i, procedure;
        console.log(procedureId);
        for (i=0; i<$scope.form.exams.length; i++) {
            procedure = $scope.form.exams[i];
            if (procedureId === procedure.id) {
                $scope.form.exams.splice(i, 1);
                return;
            }
        }
    };

    $scope.edeTotal = function() {
        return edeTotal(true);
    };

    $scope.edeTotalWithoutSOC = function() {
        return edeTotal(false);
    };

    function edeTotal(includeSOC) {
        var decimalPlaceCount = 0;
        var total = 0;
        if (includeSOC === true) {
            angular.forEach($scope.form.exams, function(item) {
                decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                total += item.ede;
            });
        } else {
            angular.forEach($scope.form.exams, function(item) {
                if (!item.soc) {
                    decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                    total += item.ede;
                }
            });
        }
        return Math.round10(total, decimalPlaceCount);
    }

    function defaultTomographyExam() {
        uniqueProcedureId++;
        return { id: uniqueProcedureId, exam: "", scans: 0, soc: false, gender: "mixed", injectedDose: 0, ede: 0 };
    }

});;angular.module("RadCalc.controllers").controller("XRayFormCtrl", function($scope, getDataService, edeCalculationService) {

    var uniqueProcedureId = 0;

    $scope.form = {
      id: "XRay",
      name: "X-ray Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
      exams:[ defaultTomographyExam() ]
    };

    $scope.allProcedures = function(categoryId) {
        return getDataService.getAllProcedures(categoryId);
    };
    
    $scope.createRow = function () {
        $scope.form.exams.push( defaultTomographyExam() );
    };
    
    $scope.submit = function(){
        console.log($scope.form.exams);
    };

    $scope.socLabel = function(value) {
        if (value) { return "Yes"; }
        return "No";
    };

    $scope.calculateEDE = function(exam) {
        if (exam.exam === "" || exam.exam === undefined) { return 0; }

        // Adjust the ede value to reflect level of precision and avoid floating point rounding errors
        var singleScanEDE = getDataService.getProcedurePropertyValue($scope.form.id, exam.exam, exam.gender);
        var unadjustedEDE = edeCalculationService.simpleEdeCalculation(singleScanEDE, exam.scans);
        var decimalPlaces = edeCalculationService.countDecimalPlaces(singleScanEDE);
        var adjustedEDE   = Math.round10(unadjustedEDE, -decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    $scope.removeProcedure = function(procedureId) {
        var i, procedure;
        console.log(procedureId);
        for (i=0; i<$scope.form.exams.length; i++) {
            procedure = $scope.form.exams[i];
            if (procedureId === procedure.id) {
                $scope.form.exams.splice(i, 1);
                return;
            }
        }
    };

    $scope.edeTotal = function() {
        return edeTotal(true);
    };

    $scope.edeTotalWithoutSOC = function() {
        return edeTotal(false);
    };

    function edeTotal(includeSOC) {
        var decimalPlaceCount = 0;
        var total = 0;
        if (includeSOC === true) {
            angular.forEach($scope.form.exams, function(item) {
                decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                total += item.ede;
            });
        } else {
            angular.forEach($scope.form.exams, function(item) {
                if (!item.soc) {
                    decimalPlaceCount = -edeCalculationService.maxDecimalPlaces(total, item.ede);
                    total += item.ede;
                }
            });
        }
        return Math.round10(total, decimalPlaceCount);
    }

    function defaultTomographyExam() {
        uniqueProcedureId++;
        return { id: uniqueProcedureId, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
    }

});;angular.module("RadCalc.services").factory("edeCalculationService", function() {

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

});;angular.module("RadCalc.services").factory("getDataService", function($q, $http) {

  var data = {};
  var getData;

  getData = function() {
    var deferred = $q.defer(),
        httpPromise = $http.get("/js/data.json");

    httpPromise.then(function (response) {
      deferred.resolve(response);
    }, function (error) {
      console.error(error);
    });

    return deferred.promise;
  };

  getData().then(function (response) {
      data = response.data;
  }, function (error) {
      console.error(error);
  });

  return {

    data: getData,

    getAllProcedures: function(categoryID) {
        for (var categoryIndex in data.DoseData) {
            var category = data.DoseData[categoryIndex];
            if (category.name == categoryID) {
                return category.exams;
            }
        }
    },

    getProcedure: function(categoryID, procedureName) {
        var allProcedures = this.getAllProcedures(categoryID);
        for (var procedureIndex in allProcedures) {
            var procedure = allProcedures[procedureIndex];
            if (procedure.name == procedureName) {
                return procedure;
            }
        }
    },

    getAllProcedureProperties: function(categoryID, procedureName) {
        var procedure = this.getProcedure(categoryID, procedureName);
        return procedure.properties;
    },

    getProcedurePropertyValue: function(categoryID, procedureName, genderPredominance) {
        var properties = this.getAllProcedureProperties(categoryID, procedureName);
        for (var propertyIndex in properties) {
            var property = properties[propertyIndex];
            if (property.gender == genderPredominance) {
                return property.value;
            }
        }
    }

  };
});;// Closure
(function(){

    /**
     * Decimal adjustment of a number.
     *
     * @param   {String}    type    The type of adjustment.
     * @param   {Number}    value   The number.
     * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number}            The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();