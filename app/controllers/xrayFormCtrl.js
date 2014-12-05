angular.module("RadCalc.controllers").controller("XRayFormCtrl", function($scope, getDataService, StoredDataService) {

    var uniqueProcedureId = 0;
    var defaultTomographyExam;
    var id = "XRay";

    defaultTomographyExam = function() {
        uniqueProcedureId++;
        return { id: uniqueProcedureId, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
    };

    initializeForm = function() {
        return {
            id: id,
            name: "X-ray Examinations",
            headers:["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)"],
            exams:[ defaultTomographyExam() ]
        };
    };

    $scope.form = initializeForm();

    if (getDataService.getFormData(id) !== null) {
        $scope.form.exams = getDataService.getFormData(id).exams;
    }

    $scope.allProcedures = function() {
        return StoredDataService.getAllProcedures(id);
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

    $scope.$watch("form", function() {
        // console.log("watch!");
        getDataService.updateFormData($scope.form);
    }, true);

    $scope.calculateEDE = function(exam) {
        if (exam.exam === "" || exam.exam === undefined) { return 0; }

        // Adjust the ede value to reflect level of precision and avoid floating point rounding errors
        var singleScanEDE = StoredDataService.getProcedurePropertyValue($scope.form.id, exam.exam, exam.gender);
        var unadjustedEDE = getDataService.simpleEdeCalculation(singleScanEDE, exam.scans);
        var decimalPlaces = getDataService.countDecimalPlaces(singleScanEDE);
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
        return getDataService.edeTotal($scope.form.id);
    };

    $scope.edeTotalWithoutSOC = function() {
        return getDataService.edeTotalWithoutSOC($scope.form.id);
    };

    $scope.edeTotalOnlySOC = function() {
        return getDataService.edeTotalOnlySOC($scope.form.id);
    };

});