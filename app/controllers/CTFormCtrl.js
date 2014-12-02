angular.module("RadCalc.controllers").controller("CTFormCtrl", function($scope, getDataService, edeCalculationService) {

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

});