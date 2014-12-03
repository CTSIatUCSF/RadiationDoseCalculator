angular.module("RadCalc.controllers").controller("NMFormCtrl", function($scope, getDataService, edeCalculationService) {

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

});