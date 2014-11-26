angular.module("RadCalc.controllers", []).controller("XRayFormCtrl", function($scope, getDataService) {

    $scope.forms = [{
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

    $scope.examData = {};
    getDataService.getData().then(function (response) {
        console.log(response.data.ConsentNarrative);
        $scope.examData = response.data.DoseData.XRay;
    }, function (error) {
        console.error(error);
    });

    function defaultTomographyExam(currentCount) {
        currentCount++;
        return { study_num: currentCount, exam: "", scans: 0, soc: false, gender: 0, ede: 0 };
    }

});