angular.module("RadCalc.controllers", []).controller("XRayFormCtrl", function($scope, getDataService) {

    $scope.forms = [{
      id: "XRay",
      name: "X-ray Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
    }];
    
    $scope.addFields = function (form) {
        form.exams.push( defaultTomographyExam(form.exams.length) );
    };
    
    $scope.submit = function(form){
        console.log(form.exams);
    };

    $scope.socLabel = function(value) {
        if (value) { return "Yes"; }
        return "No";
    };

    $scope.calculatedEDE = function(form, exam) {
        if (exam.exam === "" ||
            exam.exam === undefined) {
            return 0;
        }
        var singleScanEDE = $scope.getProcedurePropertyValue(form.id, exam.exam, exam.gender);
        exam.ede = singleScanEDE * exam.scans;
        return exam.ede;
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