angular.module("RadCalc.controllers").controller("NMFormCtrl", function($scope, getDataService, edeCalculationService) {

    $scope.form = {
      id: "NM",
      name: "Nuclear Medicine Examinations",
      headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "InjectedDose (mCi)", "EDE(mSv)"],
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
        unadjustedEDE = unadjustedEDE * exam.injectedDose;
        var decimalPlaces = edeCalculationService.countDecimalPlaces(singleScanEDE);
        var adjustedEDE   = edeCalculationService.roundEdeToDecimalPlaces(unadjustedEDE, decimalPlaces);
        exam.ede = parseFloat(adjustedEDE);
        return exam.ede;
    };

    function defaultTomographyExam(currentCount) {
        currentCount++;
        return { study_num: currentCount, exam: "", scans: 0, soc: false, gender: "mixed", injectedDose: 0, ede: 0 };
    }

});