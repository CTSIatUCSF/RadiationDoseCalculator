angular.module("RadCalc.controllers", []).controller("XRayFormCtrl", function($scope, getDataService) {

    $scope.form = {
      id: "XRay",
      name: "X-ray Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
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

    $scope.EDE = function(exam) {
        if (exam.exam === "" ||
            exam.exam === undefined) {
            return 0;
        }
        // Adjust the ede value to reflect level of precision and avoid floating point rounding errors
        var singleScanEDE = $scope.getProcedurePropertyValue($scope.form.id, exam.exam, exam.gender);
        var decimalPlaces = $scope.countDecimalPlaces(singleScanEDE);
        var unadjustedEDE = $scope.calculateEDE(singleScanEDE, exam.scans);
        var adjustedEDE   = $scope.roundEDE(unadjustedEDE, decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    $scope.calculateEDE = function(singleEDE, numScans) {
        return singleEDE * numScans;
    };

    $scope.roundEDE = function(unadjustedEDE, decimalPlaces) {
        return unadjustedEDE.toFixed(decimalPlaces);
    };

    $scope.countDecimalPlaces = function(value) {
        var valueString = "" + value;
        var ary = valueString.split(("."));
        if (ary.length < 2) {
            return 0;
        } else {
            return ary[1].length;
        }
    };

    $scope.getAllProcedures = function(categoryID) {
        for (var categoryIndex in $scope.examData.DoseData) {
            var category = $scope.examData.DoseData[categoryIndex];
            if (category.name == categoryID) {
                return category.exams;
            }
        }
    };

    $scope.getProcedure = function(categoryID, procedureName) {
        var allProcedures = $scope.getAllProcedures(categoryID);
        for (var procedureIndex in allProcedures) {
            var procedure = allProcedures[procedureIndex];
            if (procedure.name == procedureName) {
                return procedure;
            }
        }
    };

    $scope.getAllProcedureProperties = function(categoryID, procedureName) {
        var procedure = $scope.getProcedure(categoryID, procedureName);
        return procedure.properties;
    };

    $scope.getProcedurePropertyValue = function(categoryID, procedureName, genderPredominance) {
        var properties = $scope.getAllProcedureProperties(categoryID, procedureName);
        for (var propertyIndex in properties) {
            var property = properties[propertyIndex];
            if (property.gender == genderPredominance) {
                return property.value;
            }
        }
    };

    $scope.examData = {};
    getDataService.getData().then(function (response) {
        $scope.examData = response.data;
    }, function (error) {
        console.error(error);
    });

    function defaultTomographyExam(currentCount) {
        currentCount++;
        return { study_num: currentCount, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
    }

});