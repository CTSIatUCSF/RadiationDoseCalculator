var app = angular.module("radcalc", []);

app.controller("DataEntryCtrl", function($scope) {
	
	$scope.forms = [{
      name: "X-ray Computed Tomography Examinations",
      headers:["Study", "Examination", "Total # Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)", "# scans/year", "Annual EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
    },{
      name: "Nuclear Medicine Examinations",
      headers:["Study", "Examination", "Total # Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)", "# scans/year", "Annual EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
    },{
      name: "X-ray Examinations",
      headers:["Study", "Examination", "Total # Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)", "# scans/year", "Annual EDE(mSv)"],
      exams:[ defaultTomographyExam(0) ]
    },{
      name: "Flouroscopy Examinations",
      headers:["Study", "Examination", "Total # Scans", "Standard of Care?", "Gender Predominance", "EDE(mSv)", "# scans/year", "Annual EDE(mSv)"],
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

    function defaultTomographyExam(currentCount) {
    	currentCount++;
    	return { study_num: currentCount, exam: "", total_scans: 0, soc: false, gender: 0, ede: 0, scans_per_year:0, annual_ede: 0 };
    }
});