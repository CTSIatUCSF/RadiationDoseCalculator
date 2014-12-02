angular.module("RadCalc.controllers", []);
angular.module("RadCalc.services", []);
angular.module("RadCalc.directives", []);

var app = angular.module("RadCalc", [
  "RadCalc.services",
  "RadCalc.controllers"
]);;angular.module("RadCalc.controllers").controller("CTFormCtrl", function($scope, getDataService, edeCalculationService) {

    $scope.form = {
      id: "CT",
      name: "X-ray Computed Tomography Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
    };

    $scope.allProcedures = function(categoryId) {
        return getDataService.getAllProcedures(categoryId);
    };
    
    $scope.createRow = function () {
        $scope.form.exams.push( defaultTomographyExam($scope.form.exams.length) );
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
        var adjustedEDE   = edeCalculationService.roundEdeToDecimalPlaces(unadjustedEDE, decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    function defaultTomographyExam(currentCount) {
        currentCount++;
        return { study_num: currentCount, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
    }

});;angular.module("RadCalc.controllers").controller("CommonFormCtrl", function($scope, getDataService) {

    $scope.testVariable = "This is my test variable!";

});;angular.module("RadCalc.controllers").controller("XRayFormCtrl", function($scope, getDataService, edeCalculationService) {

    $scope.form = {
      id: "XRay",
      name: "X-ray Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
    };

    $scope.allProcedures = function(categoryId) {
        return getDataService.getAllProcedures(categoryId);
    };
    
    $scope.createRow = function () {
        $scope.form.exams.push( defaultTomographyExam($scope.form.exams.length) );
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
        var adjustedEDE   = edeCalculationService.roundEdeToDecimalPlaces(unadjustedEDE, decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    function defaultTomographyExam(currentCount) {
        currentCount++;
        return { study_num: currentCount, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
    }

});;angular.module("RadCalc.services").factory("edeCalculationService", function() {

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
});