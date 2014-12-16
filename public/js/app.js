angular.module("RadCalc.controllers", []);
angular.module("RadCalc.services", []);
angular.module("RadCalc.directives", []);
angular.module("RadCalc.filter", []);

var app = angular.module("RadCalc", [
    "ui.router",
    "ui.bootstrap",
    "RadCalc.services",
    "RadCalc.controllers",
    "RadCalc.directives",
    "RadCalc.filter"
]);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/");
    
    $stateProvider
        
        .state("data-entry", {
            controller: "DataEntryCtrl",
            url: "/",
            templateUrl: "views/partial-data-entry.html",
            resolve: {
                "storedDataService":function(StoredDataService) {
                    return StoredDataService.promise;
                }
            }
        })

        .state("json-editor", {
            url: "/json-editor",
            controller: "JsonEditCtrl",
            templateUrl: "views/partial-json-editor.html",
            resolve: {
                "storedDataService":function(StoredDataService) {
                    return StoredDataService.promise;
                }
            }
        })

        .state("report-formatted", {
            url: "/report-formatted",
            templateUrl: "views/partial-report-formatted.html"
        })

        .state("report-plaintext", {
            url: "/report-plaintext",
            templateUrl: "views/partial-report-plaintext.html"
        });
});;angular.module("RadCalc.controllers").controller("DataEntryCtrl", function($scope, $state, UserDataService, StoredDataService, ConfigDataService) {

    var configData = ConfigDataService.data;
    var storedData = StoredDataService.storedData();
    var userData   = UserDataService.getAllProcedures();

    var enforceMinimumExamCount, defaultProcedure, getProcedureId,
        getCategoryConfig, updateUserDataService, isValidProcedure;

    enforceMinimumExamCount = function(categoryId) {
        var procedures = $scope.getProcedures(categoryId);
        if (procedures.length < 1) {
            $scope.allProcedures.push(defaultProcedure(categoryId));
        }
    };

    defaultProcedure = function(categoryId) {
        var config = getCategoryConfig(categoryId);
        var procedure = JSON.parse(JSON.stringify(config.defaultrow));
        procedure.id = getProcedureId(categoryId);
        return procedure;
    };

    getProcedureId = function(categoryId) {
        var procedures = $scope.getProcedures(categoryId);
        return procedures.length;
    };

    getCategoryConfig = function(categoryId) {
        var index, category;
        var categories = configData.categories;
        for (index in categories) {
            category = categories[index];
            if (categoryId === category.id) {
                return category;
            }
        }
    };

    isValidProcedure = function(procedure) {
        if (!procedure)                 { return false; }
        if (!procedure.exam)            { return false; }
        if (procedure.exam.length < 1)  { return false; }
        return true;
    };

    updateUserDataService = function() {
        var validProcedures = [];
        var index, procedure;
        for (index=0; index<$scope.allProcedures.length; index++) {
            procedure = $scope.allProcedures[index];
            if (isValidProcedure(procedure)) {
                validProcedures.push(procedure);
            }
        }
        UserDataService.updateProcedures(validProcedures);
    };

    $scope.allProcedures = [];
    $scope.supplementalConsentLanguage = UserDataService.getSupplementalConsentText() || "";
    if (userData.length > 0) { $scope.allProcedures = userData; }
    $scope.$watch("allProcedures", updateUserDataService, true);

    $scope.getCategoryConfig = getCategoryConfig;

    $scope.getProcedures = function(categoryId) {
        var index, procedure;
        var procedures = [];
        for (index=0; index<$scope.allProcedures.length; index++) {
            procedure = $scope.allProcedures[index];
            if (categoryId === procedure.categoryid) {
                procedures.push(procedure);
            }
        }
        return procedures;
    };

    $scope.getStoredProcedures = function(categoryId) {
        return StoredDataService.getAllProcedures(categoryId);
    };

    $scope.newProcedure = function(categoryId) {
        $scope.allProcedures.push(defaultProcedure(categoryId));
    };

    $scope.removeProcedure = function(categoryId, procedureId) {
        var index, procedure;
        for (index=0; index<$scope.allProcedures.length; index++) {
            procedure = $scope.allProcedures[index];
            if (categoryId === procedure.categoryid && procedureId === procedure.id) {
                $scope.allProcedures.splice(index, 1);
                // enforceMinimumExamCount(categoryId);
                return;
            }
        }
    };

    $scope.getProcedureEdeCalculation = function(procedure) {
        var baseEde = StoredDataService.getProcedurePropertyValue(procedure.categoryid, procedure.exam, procedure.gender);
        var calculatedEde = UserDataService.getProcedureEdeCalculation(procedure, baseEde);
        procedure.ede = calculatedEde;
        return calculatedEde;
    };

    $scope.getProcedureAnnualEdeCalculation = function(procedure) {
        var baseEde = StoredDataService.getProcedurePropertyValue(procedure.categoryid, procedure.exam, procedure.gender);
        var calculatedEde = UserDataService.getProcedureEdeCalculation(procedure, baseEde);
        var annualEde = calculatedEde/(procedure.scans/procedure.annualscans);
        annualEde = Math.round10(annualEde, -2);
        procedure.annualede = annualEde;
        return annualEde;
    };

    $scope.edeTotal = function(categoryId) {
        return UserDataService.edeTotal(categoryId);
    };

    $scope.edeTotalWithoutSOC = function(categoryId) {
        return UserDataService.edeTotalWithoutSOC(categoryId);
    };

    $scope.edeTotalOnlySOC = function(categoryId) {
        return UserDataService.edeTotalOnlySOC(categoryId);
    };

    $scope.edeAnnualTotal = function(categoryId) {
        return UserDataService.edeAnnualTotal(categoryId);
    };

    $scope.edeAnnualTotalWithoutSOC = function(categoryId) {
        return UserDataService.edeAnnualTotalWithoutSOC(categoryId);
    };

    $scope.edeAnnualTotalOnlySOC = function(categoryId) {
        return UserDataService.edeAnnualTotalOnlySOC(categoryId);
    };

    $scope.GenerateReportClicked = function() {
        validateUserData();
        updateSupplementalConsentText();
        $state.go("report-formatted", {storedData: storedData}, {location: true, inherit: false});
    };

    $scope.EditJsonDataClicked = function() {
        $state.go("json-editor", {storedData: storedData}, {location: true, inherit: false});
    };

    $scope.ResetAll = function() {
        var procedureIndex, procedure;
        for (procedureIndex in $scope.allProcedures) {
            procedure = $scope.allProcedures[procedureIndex];
            $scope.removeProcedure(procedure.categoryid, procedure.id);
        }
    };

    function validateUserData() {
        console.log("Validate User Data!");
    }
    
    function updateSupplementalConsentText() {
        UserDataService.addSupplementalConsentText($scope.supplementalConsentLanguage);
    }

});;angular.module("RadCalc.controllers").controller("JsonEditCtrl", function($scope, $state, StoredDataService, ConfigDataService) {

    var createNewProcedure, getCategory, getProcedureIndex;

    createNewProcedure = function() {
        return  {
            "name":"new procedure ",
            "citation": "sample citation",
            "properties":[
                {
                    "name":"EDE (female)",
                    "gender":"female",
                    "value":0
                },
                {
                    "name":"EDE (male)",
                    "gender":"male",
                    "value":0
                },
                {
                    "name":"EDE (mixed)",
                    "gender":"mixed",
                    "value":0
                }
            ]
        };
    };

    $scope.storedData = StoredDataService.storedData();

    $scope.saveJson = function() {
        console.log("saving...");
        saveAs(
            new Blob(
                [JSON.stringify($scope.storedData, null, 4)], { type: "application/json" }
            ), "data.json"
        );
    };

    $scope.getCategoryName = function(categoryId) {
        return ConfigDataService.getNameForId(categoryId);
    };

    $scope.removeProcedure = function(categoryId, procedureName) {
        var category;
        procedureIndex = getProcedureIndex(categoryId, procedureName);
        category = getCategory(categoryId);
        category.exams.splice(procedureIndex, 1);
    };

    $scope.addProcedure = function(categoryId) {
        var category, newProc;
        category = getCategory(categoryId);
        newProcedure = createNewProcedure();
        newProcedure.name += (category.exams.length + 1);
        category.exams.splice(0, 0, newProcedure);
    };

    $scope.DataEntryClicked = function() {
        $state.go("data-entry", {location: true, inherit: false});
    };

    getCategory = function(categoryId) {
            console.log(categoryId);

        var doseData = $scope.storedData.DoseData;
        var categoryIndex, category;
        for (categoryIndex in doseData) {
            console.log(categoryIndex);
            category = doseData[categoryIndex];
            if (category.name === categoryId) {
                return category;
            }
        }
    };

    getProcedureIndex = function(categoryId, procedureName) {
        var category = getCategory(categoryId);
        var procedureIndex, procedure;
        for (procedureIndex in category.exams) {
            procedure = category.exams[procedureIndex];
            if (procedure.name === procedureName) {
                return procedureIndex;
            }
        }
    };

});;angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, UserDataService, StoredDataService) {

    var storedData = StoredDataService.storedData();
    var userData   = UserDataService.getAllProcedures();
    var plainTextFormattingOptions = {
        "col1":1,
        "col2":30,
        "col3":40,
        "col4":50,
        "col5":60,
        "col6":70,
    };
    var comparisonDoseMsv, effectiveDose, convertMsvToRem, convertRemToMsv,
        comparisonDoseQuotient, buildBibliography, addPadding, getCitationText,
        footnotePlainText;

    comparisonDoseMsv = function () {
        var dose;
        if (storedData.ComparisonDoseUnit === "rem") {
            dose = convertRemToMsv(storedData.ComparisonDose);
        } else if (storedData.ComparisonDoseUnit === "mSv") {
            dose = storedData.ComparisonDose;
        }
        return Math.round10(dose, -2);
    };

    effectiveDose = function(unit) {
        var dose;
        if (storedData.EffectiveDoseType === "Research") {
            dose = $scope.edeReportTotalWithoutSOC();
        } else {
            dose = $scope.edeReportTotal();
        }
        if (unit === "rem") {
            dose = convertMsvToRem(dose);
        }
        return Math.round10(dose, -2);
    };

    convertMsvToRem = function(mSv_number) {
        return Math.round10(mSv_number/10, -2);
    };

    convertRemToMsv = function(rem_number) {
        return Math.round10(rem_number*10, -2);
    };

    comparisonDoseQuotient = function() {
        var dose = effectiveDose("mSv");
        var cdq = dose / comparisonDoseMsv();
        cdq = cdq || 0;
        return Math.round10(cdq, -2);
    };

    buildBibliography = function() {
        var categoryIds = ["CT", "NM", "XRay", "Flouro"];
        var bibliography = {};
        var footnotes = {};
        var citations = [];
        var counter = 1;
        var categoryIndex, categoryId, procedures, procedureIndex, procedure;
        for (categoryIndex in categoryIds) {
            categoryId = categoryIds[categoryIndex];
            procedures = UserDataService.getProcedures(categoryId);
            footnotes[categoryId] = [];
            for (procedureIndex in procedures) {
                footnotes[categoryId].push(counter);
                procedure = procedures[procedureIndex];
                citations.push(counter++ + ". " + getCitationText(procedure));
            }
        }
        bibliography = {"footnotes": footnotes, "citations": citations};

        return bibliography;
    };

    getCitationText = function(procedure) {
        var citation = "";
        if (procedure.exam) {
            citation = StoredDataService.getProcedureCitation(procedure.categoryid, procedure.exam);
        }
        return citation;
    };

    addPadding = function(string, maxWidth, spacer) {
        spacer = spacer || " ";
        spacer = spacer.charAt(0);
        string = "" + string;
        while (string.length < maxWidth) {
            string += spacer;
        }
        return string;
    };

    footnotePlainText = function(categoryId) {
        var footnotes = $scope.footnotes(categoryId);
        if (footnotes !== "") {
            footnotes = "[" + footnotes + "]";
        }
        return footnotes;
    };

    $scope.consentNarrative = function() {
        var cn;
        var unit = storedData.ComparisonDoseUnit;

        cn = storedData.ConsentNarrative || "";
        cn = cn.split("<<effectiveDose>>").join(effectiveDose(unit));
        cn = cn.split("<<comparisonDose>>").join(storedData.ComparisonDose);
        cn = cn.split("<<comparisonDoseUnit>>").join(storedData.ComparisonDoseUnit);
        cn = cn.split("<<comparisonDoseQuotient>>").join(comparisonDoseQuotient());
        return cn;
    };
    
    $scope.supplementalConsentLanguage = userData.supplementalConsentText || "";
    $scope.bibliography = buildBibliography();

    $scope.citations = function() {
        return $scope.bibliography.citations;
    };

    $scope.footnotes = function(categoryId) {
        var footnotes = $scope.bibliography.footnotes[categoryId];
        var shrunk = "";
        if (footnotes.length === 1) {
            shrunk = "" + footnotes[0];
        } else if (footnotes.length > 1) {
            first = footnotes[0];
            last = footnotes[footnotes.length-1];
            shrunk = first + "-" + last;
        }
        return shrunk;
    };

    $scope.makePlainText = function() {
        var opt = plainTextFormattingOptions;
        var citations = $scope.bibliography.citations;
        var citationIndex, citation;
        var edeLabelText = "EDE(mSv)";

        var plaintext = "\n";
        plaintext += "Radiation Dose Calculator\n";
        plaintext += "\n";

        plaintext += addPadding(" ", opt.col2);
        plaintext += addPadding("Total", opt.col3 - opt.col2);
        plaintext += addPadding("Total", opt.col4 - opt.col3);
        plaintext += addPadding("Annual", opt.col5 - opt.col4);
        plaintext += addPadding("Annual", opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Types of Procedures", opt.col2);
        plaintext += addPadding("Scans", opt.col3 - opt.col2);
        plaintext += addPadding(edeLabelText, opt.col4 - opt.col3);
        plaintext += addPadding("Scans", opt.col5 - opt.col4);
        plaintext += addPadding(edeLabelText, opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("", opt.col5 + edeLabelText.length, "-");
        plaintext += "\n";

        plaintext += addPadding("X-Ray CT " + footnotePlainText("CT"), opt.col2);
        plaintext += addPadding($scope.getScanCount("CT"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("CT"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("CT"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("CT"), 2), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Nuclear Medicine " + footnotePlainText("NM"), opt.col2);
        plaintext += addPadding($scope.getScanCount("NM"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("NM"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("NM"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("NM"), 2), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Radiography " + footnotePlainText("XRay"), opt.col2);
        plaintext += addPadding($scope.getScanCount("XRay"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("XRay"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("XRay"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("XRay"), 2), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Flouroscopy " + footnotePlainText("Flouro"), opt.col2);
        plaintext += addPadding($scope.getScanCount("Flouro"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("Flouro"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("Flouro"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("Flouro"), 2), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += "\n";
        plaintext += "\n";
        plaintext += addPadding(" ", opt.col2);
        plaintext += addPadding("Total", opt.col3 - opt.col2);
        plaintext += addPadding("Annual", opt.col4 - opt.col3);
        plaintext += "\n";
        plaintext += addPadding("", opt.col5 + edeLabelText.length, "-");
        plaintext += "\n";

        plaintext += addPadding("Research EDE (mSv)", opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportTotalWithoutSOC(), 2), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportAnnualTotalWithoutSOC(), 2), opt.col4 - opt.col3);
        plaintext += "\n";

        plaintext += addPadding("Standard of Care (mSv)", opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportTotalOnlySOC(), 2), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportAnnualTotalOnlySOC(), 2), opt.col4 - opt.col3);
        plaintext += "\n";

        plaintext += addPadding("Total EDE (mSv)", opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportTotal(), 2), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportAnnualTotal(), 2), opt.col4 - opt.col3);
        plaintext += "\n";

        plaintext += "\n";
        plaintext += "\n";
        plaintext += addPadding("", opt.col5 + edeLabelText.length, "-");
        plaintext += "\n";

        plaintext += "Consent Narrative" + "\n";
        plaintext += $scope.consentNarrative() + "\n";
        plaintext += "\n";

        plaintext += "Supplemental Consent Language" + "\n";
        plaintext += $scope.getSupplementalConsentText() + "\n";
        plaintext += "\n";

        plaintext += "Citations" + "\n";
        console.log(citations);
        for (citationIndex in citations) {
            citation = citations[citationIndex];
            plaintext += citation + "\n";
        }

        return plaintext;
    };

    $scope.DataEntryClicked = function() {
        $state.go("data-entry", {storedData: storedData}, {location: true, inherit: false});
    };

    $scope.FormattedReportClicked = function() {
        $state.go("report-formatted", {storedData: storedData}, {location: true, inherit: false});
    };

    $scope.PlainTextReportClicked = function() {
        $state.go("report-plaintext", {storedData: storedData}, {location: true, inherit: false});
    };

    $scope.Print = function() {
        window.print();
    };

    $scope.getSupplementalConsentText = function() {
        return UserDataService.getSupplementalConsentText();
    };

    $scope.getScanCount = function(categoryId) {
        return UserDataService.getScanCount(categoryId);
    };

    $scope.getAnnualScanCount = function(categoryId) {
        return UserDataService.getAnnualScanCount(categoryId);
    };

    $scope.edeTotal = function(categoryId) {
        return UserDataService.edeTotal(categoryId);
    };

    $scope.edeTotalWithoutSOC = function(categoryId) {
        return UserDataService.edeTotalWithoutSOC(categoryId);
    };

    $scope.edeTotalOnlySOC = function(categoryId) {
        return UserDataService.edeTotalOnlySOC(categoryId);
    };

    $scope.edeReportTotal = function() {
        return UserDataService.edeReportTotal();
    };

    $scope.edeReportTotalOnlySOC = function() {
        return UserDataService.edeReportTotalOnlySOC();
    };

    $scope.edeReportTotalWithoutSOC = function() {
        return UserDataService.edeReportTotalWithoutSOC();
    };

    $scope.edeReportAnnualTotal = function() {
        return UserDataService.edeReportAnnualTotal();
    };

    $scope.edeReportAnnualTotalOnlySOC = function() {
        return UserDataService.edeReportAnnualTotalOnlySOC();
    };

    $scope.edeReportAnnualTotalWithoutSOC = function() {
        return UserDataService.edeReportAnnualTotalWithoutSOC();
    };

    $scope.edeAnnualTotal = function(categoryId) {
        return UserDataService.edeAnnualTotal(categoryId);
    };

    $scope.edeAnnualTotalOnlySOC = function(categoryId) {
        return UserDataService.edeAnnualTotalOnlySOC(categoryId);
    };

    $scope.edeAnnualTotalWithoutSOC = function(categoryId) {
        return UserDataService.edeAnnualTotalWithoutSOC(categoryId);
    };
});;angular.module("RadCalc").directive("ctTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-ct-table-header.html"
    };
});;angular.module("RadCalc").directive('ngConfirmClick', [function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$apply(clickAction);
                    }
                });
            }
        };
}]);;angular.module("RadCalc").directive("flouroTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-flouro-table-header.html"
    };
});;angular.module("RadCalc").directive("nmTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-nm-table-header.html"
    };
});;angular.module("RadCalc").directive("numbersOnly", function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});;angular.module("RadCalc").directive("twoDecimals", [function () {
  
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
      
            var toView = function (value) {
                return decimalFormatter.format(value, 2);
            };
      
            ngModel.$formatters.unshift(toView);
        }
    };
}]);;angular.module("RadCalc").directive("xrayTable", function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "views/partial-xray-table-header.html"
    };
});;angular.module("RadCalc").filter("twoDecimalsFilter", function () {

    return function (value) {
        return decimalFormatter.format(value, 2);
    };
});;angular.module("RadCalc.services").factory("ConfigDataService", function() {

    var data = {
        "categories": [
            {
                "id": "CT",
                "name": "X-ray Computed Tomography Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", " ", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "CT", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "ede": 0, "annualscans": 1, "annualede": 0 }
            },
            {
                "id": "NM",
                "name": "Nuclear Medicine Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Injected Dose (mCi)", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "NM", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "injectedDose": 0, "ede": 0, "annualscans": 1, "annualede": 0 }
            },
            {
                "id": "XRay",
                "name": "X-ray Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", " ", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "XRay", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "ede": 0, "annualscans": 1, "annualede": 0 }
            },
            {
                "id": "Flouro",
                "name": "Flouroscopy Examinations",
                "headers": ["Study", "Examination", "# Scans", "Standard of Care?", "Gender Predominance", "Minutes", "EDE (mSv)", "# Scans/year", "Annual EDE (mSv)"],
                "defaultrow": { "id": 0, "categoryid": "Flouro", "exam": "", "scans": 1, "soc": false, "gender": "mixed", "minutes": 0, "ede": 0, "annualscans": 1, "annualede": 0 }
            }
        ]
    };

    getNameForId = function(id) {
        var index, category;
        for (index in data.categories) {
            category = data.categories[index];
            if (category.id === id) {
                return category.name;
            }
        }
        return id;
    };

    return {
        "data": data,
        "getNameForId": getNameForId
    };

});;angular.module("RadCalc.services").factory("StoredDataService", function($q, $http) {

    var storedData = {};
    var promise;

    promise = $http.get("/js/data/data.json").success(function (response) {
      storedData = response;
    });

    return {

        promise:promise,

        storedData: function() {
            return storedData;
        },

        consentNarrative: function() {
            return storedData.ConsentNarrative;
        },

        comparisonDose: function() {
            return storedData.ComparisonDose;
        },

        comparisonDoseUnit: function() {
            return storedData.ComparisonDoseUnit;
        },

        effectiveDoseType: function() {
            return storedData.EffectiveDoseType;
        },

        getAllProcedures: function(categoryID) {
            for (var categoryIndex in storedData.DoseData) {
                var category = storedData.DoseData[categoryIndex];
                if (category.name == categoryID) {
                    return category.exams;
                }
            }
        },

        getProcedure: function(categoryID, procedureName) {
            if (procedureName === "" || procedureName === null || procedureName === undefined) { return; }
            var allProcedures = this.getAllProcedures(categoryID);
            for (var procedureIndex in allProcedures) {
                var procedure = allProcedures[procedureIndex];
                if (procedure.name == procedureName) {
                    return procedure;
                }
            }
        },

        getProcedureCitation: function(categoryID, procedureName) {
            if (procedureName === null) { return; }
            var procedure = this.getProcedure(categoryID, procedureName);
            return procedure.citation;
        },

        getAllProcedureProperties: function(categoryID, procedureName) {
            if (procedureName === "" || procedureName === null || procedureName === undefined) { return; }
            var procedure = this.getProcedure(categoryID, procedureName);
            return procedure.properties;
        },

        getProcedurePropertyValue: function(categoryID, procedureName, genderPredominance) {
            if (procedureName === "" || procedureName === null || procedureName === undefined) { return; }
            var properties = this.getAllProcedureProperties(categoryID, procedureName);
            for (var propertyIndex in properties) {
                var property = properties[propertyIndex];
                if (property.gender == genderPredominance) {
                    return property.value;
                }
            }
        }

    };
});;angular.module("RadCalc.services").factory("UserDataService", function($q, $http) {

    // Private
    var userData = {};
    userData.totals = {
        "CT": {
            "total": {
                "additionalEde": 0,
                "includingSOC": 0
            },
            "annual": {
                "additionalEde": 0,
                "includingSOC": 0
            }
        },
        "NM": {
            "total": {
                "additionalEde": 0,
                "includingSOC": 0
            },
            "annual": {
                "additionalEde": 0,
                "includingSOC": 0
            }
        },
        "XRay": {
            "total": {
                "additionalEde": 0,
                "includingSOC": 0
            },
            "annual": {
                "additionalEde": 0,
                "includingSOC": 0
            }
        },
        "Flouro": {
            "total": {
                "additionalEde": 0,
                "includingSOC": 0
            },
            "annual": {
                "additionalEde": 0,
                "includingSOC": 0
            }
        }};
    var allProcedures = [];
    var getProcedures, addProcedure, getCategoryEdeTotal,
        addSupplementalConsentText, getSupplementalConsentText,
        getProcedureEdeCalculation, getReportAnnualEdeTotal, updateProcedures,
        getAnnualScanCount, getScanCount;

    getAllProcedures = function() {
        return allProcedures;
    };

    getProcedures = function(categoryId) {
        var procedureIndex, procedure,
            procedures = [];
        for (procedureIndex in allProcedures) {
            procedure = allProcedures[procedureIndex];
            if (procedure.categoryid === categoryId) {
                procedures.push(procedure);
            }
        }
        return procedures;
    };

    addProcedure = function(procedure) {
        if (procedure.exam !== "" && procedure.exam !== undefined) {
            allProcedures.push(procedure);
        }
    };

    getCategoryEdeTotal = function(categoryId, onlySOC) {
        var procedureIndex, procedure,
            ede = 0,
            procedures = getProcedures(categoryId);
        for (procedureIndex in procedures) {
            procedure = procedures[procedureIndex];
            if (procedure.soc === onlySOC) {
                ede += procedure.ede;
            }
        }
        return Math.round10(ede, -2);
    };

    getCategoryAnnualEdeTotal = function(categoryId, onlySOC) {
        var procedureIndex, procedure,
            annualede = 0,
            procedures = getProcedures(categoryId);
        for (procedureIndex in procedures) {
            procedure = procedures[procedureIndex];
            if (procedure.soc === onlySOC) {
                annualede += procedure.annualede;
            }
        }
        return Math.round10(annualede, -2);
    };

    getReportAnnualEdeTotal = function(onlySOC) {
        var procedureIndex, procedure,
            annualede = 0;
        for (procedureIndex in allProcedures) {
            procedure = allProcedures[procedureIndex];
            if (procedure.soc === onlySOC) {
                annualede += procedure.annualede;
            }
        }
        return Math.round10(annualede, -2);
    };

    addSupplementalConsentText = function(supplementalConsentText) {
        userData.supplementalConsentText = supplementalConsentText;
    };

    getSupplementalConsentText = function() {
        return userData.supplementalConsentText ;
    };

    getTotals = function() {
        return userData.totals ;
    };

    getProcedureEdeCalculation = function(procedure, baseEde) {
        var calculation = 0;
        
        // simple calculation for all
        if (procedure.hasOwnProperty("scans")) {
            calculation = procedure.scans * baseEde;
        }

        // adjust for NM calculation
        if (procedure.hasOwnProperty("categoryid") && procedure.categoryid === "NM" ) {
            if (procedure.hasOwnProperty("injectedDose")) {
                calculation = procedure.injectedDose * calculation;
            }
        }

        // adjust for Flouro calculation
        if (procedure.hasOwnProperty("categoryid") && procedure.categoryid === "Flouro" ) {
            if (procedure.hasOwnProperty("minutes")) {
                calculation = procedure.minutes * calculation;
            }
        }

        return Math.round10(calculation, -2);
    };

    updateProcedures = function(procedures) {
        allProcedures = procedures;
        updateTotals();
    };

    updateTotals = function() {
        var ary = ["CT", "NM", "XRay", "Flouro"];
        var i, category;
        for (i=0; i<ary.length; i++) {
            categoryId = ary[i];
            userData.totals[categoryId].total.additionalEde = edeTotalWithoutSOC(categoryId);
            userData.totals[categoryId].total.includingSOC = edeTotal(categoryId);
            userData.totals[categoryId].annual.additionalEde = edeAnnualTotalWithoutSOC(categoryId);
            userData.totals[categoryId].annual.includingSOC = edeAnnualTotal(categoryId);
        }
    };

    getScanCount = function(categoryId) {
        var count = 0;
        var procedures = getProcedures(categoryId);
        angular.forEach(procedures, function(procedure) {
            count += procedure.scans;
        });
        return count;
    };

    getAnnualScanCount = function(categoryId) {
        var count = 0;
        var procedures = getProcedures(categoryId);
        angular.forEach(procedures, function(procedure) {
            count += procedure.annualscans;
        });
        return count;
    };

    // Section Totals

    /*
    categoryId = identifies which section of the report to return data for.
        Should correspond to the id value on a form controller. (ex: CT)

    Returns total EDE for a section of the report, regardless of Standard of Care value
    */
    edeTotal = function(categoryId) {
        var onlySOC = edeTotalOnlySOC(categoryId);
        var withoutSOC = edeTotalWithoutSOC(categoryId);
        var totalSOC = onlySOC + withoutSOC;
        var answer = Math.round10(totalSOC, -2);
        return answer;
    };

    /*
    categoryId = Identifies which section of the report to return data for.
        Should correspond to the id value on a form controller. (ex: CT)

    Returns total EDE for a section of the report, excluding items marked as Standard of Care
    */
    edeTotalWithoutSOC = function(categoryId) {
        return getCategoryEdeTotal(categoryId, false);
    };

    /*
    categoryId = identifies which section of the report to return data for.
        Should correspond to the id value on a form controller. (ex: CT)

    Returns total EDE for a section of the report, excluding items that are not marked as Standard of Care
    */
    edeTotalOnlySOC = function(categoryId) {
        return getCategoryEdeTotal(categoryId, true);
    };


    edeAnnualTotal = function(categoryId) {
        var onlySOC = edeAnnualTotalOnlySOC(categoryId);
        var withoutSOC = edeAnnualTotalWithoutSOC(categoryId);
        var totalSOC = onlySOC + withoutSOC;
        var answer = Math.round10(totalSOC, -2);
        return answer;
    };

    edeAnnualTotalWithoutSOC = function(categoryId) {
        return getCategoryAnnualEdeTotal(categoryId, false);
    };

    edeAnnualTotalOnlySOC = function(categoryId) {
        return getCategoryAnnualEdeTotal(categoryId, true);
    };

    // Report Totals 

    /*
    Returns total EDE for the entire report, regardless of Standard of Care value
    */
    edeReportTotal = function() {
        var procedureIndex, procedure;
        var total = 0;
        for (procedureIndex in allProcedures) {
            procedure = allProcedures[procedureIndex];
            total += procedure.ede;
        }
        
        return Math.round10(total, -2);
    };

    /*
    Returns total EDE for the entire report, excluding items marked as Standard of Care
    */
    edeReportTotalWithoutSOC = function() {
        var procedureIndex, procedure;
        var total = 0;
        for (procedureIndex in allProcedures) {
            procedure = allProcedures[procedureIndex];
            if (procedure.soc === false) {
                total += procedure.ede;
            }
        }
        
        return Math.round10(total, -2);
    };

    /*
    Returns total EDE for the entire report, excluding items that are not marked as Standard of Care
    */
    edeReportTotalOnlySOC = function() {
        var procedureIndex, procedure;
        var total = 0;
        for (procedureIndex in allProcedures) {
            procedure = allProcedures[procedureIndex];
            if (procedure.soc === true) {
                total += procedure.ede;
            }
        }
        
        return Math.round10(total, -2);
    };

    edeReportAnnualTotal = function() {
        var onlySOC = edeReportAnnualTotalOnlySOC();
        var withoutSOC = edeReportAnnualTotalWithoutSOC();
        var totalSOC = onlySOC + withoutSOC;
        var answer = Math.round10(totalSOC, -2);
        return answer;
    };

    edeReportAnnualTotalWithoutSOC = function() {
        return getReportAnnualEdeTotal(false);
    };

    edeReportAnnualTotalOnlySOC = function() {
        return getReportAnnualEdeTotal(true);
    };

  return {

    // Public
    
    getAllProcedures: getAllProcedures,
    getProcedures: getProcedures,
    addProcedure: addProcedure,
    getCategoryEdeTotal: getCategoryEdeTotal,
    addSupplementalConsentText: addSupplementalConsentText,
    getSupplementalConsentText: getSupplementalConsentText,
    getTotals: getTotals,
    getProcedureEdeCalculation: getProcedureEdeCalculation,
    updateProcedures: updateProcedures,
    edeTotal: edeTotal,
    edeTotalWithoutSOC: edeTotalWithoutSOC,
    edeTotalOnlySOC: edeTotalOnlySOC,
    edeAnnualTotal: edeAnnualTotal,
    edeAnnualTotalOnlySOC: edeAnnualTotalOnlySOC,
    edeAnnualTotalWithoutSOC: edeAnnualTotalWithoutSOC,
    edeReportTotal: edeReportTotal,
    edeReportTotalWithoutSOC: edeReportTotalWithoutSOC,
    edeReportTotalOnlySOC: edeReportTotalOnlySOC,
    edeReportAnnualTotal: edeReportAnnualTotal,
    edeReportAnnualTotalWithoutSOC: edeReportAnnualTotalWithoutSOC,
    edeReportAnnualTotalOnlySOC: edeReportAnnualTotalOnlySOC,
    getScanCount: getScanCount,
    getAnnualScanCount: getAnnualScanCount

  };
});;/**
 * State-based routing for AngularJS
 * @version v0.2.12
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ui.router"),function(a,b,c){"use strict";function d(a,b){return M(new(M(function(){},{prototype:a})),b)}function e(a){return L(arguments,function(b){b!==a&&L(b,function(b,c){a.hasOwnProperty(c)||(a[c]=b)})}),a}function f(a,b){var c=[];for(var d in a.path){if(a.path[d]!==b.path[d])break;c.push(a.path[d])}return c}function g(a){if(Object.keys)return Object.keys(a);var c=[];return b.forEach(a,function(a,b){c.push(b)}),c}function h(a,b){if(Array.prototype.indexOf)return a.indexOf(b,Number(arguments[2])||0);var c=a.length>>>0,d=Number(arguments[2])||0;for(d=0>d?Math.ceil(d):Math.floor(d),0>d&&(d+=c);c>d;d++)if(d in a&&a[d]===b)return d;return-1}function i(a,b,c,d){var e,i=f(c,d),j={},k=[];for(var l in i)if(i[l].params&&(e=g(i[l].params),e.length))for(var m in e)h(k,e[m])>=0||(k.push(e[m]),j[e[m]]=a[e[m]]);return M({},j,b)}function j(a,b,c){if(!c){c=[];for(var d in a)c.push(d)}for(var e=0;e<c.length;e++){var f=c[e];if(a[f]!=b[f])return!1}return!0}function k(a,b){var c={};return L(a,function(a){c[a]=b[a]}),c}function l(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));for(var d in a)-1==c.indexOf(d)&&(b[d]=a[d]);return b}function m(a,b){var c=K(a)?[]:{};return L(a,function(a,d){b(a,d)&&(c[d]=a)}),c}function n(a,b){var c=K(a)?[]:{};return L(a,function(a,d){c[d]=b(a,d)}),c}function o(a,b){var d=1,f=2,i={},j=[],k=i,m=M(a.when(i),{$$promises:i,$$values:i});this.study=function(i){function n(a,c){if(s[c]!==f){if(r.push(c),s[c]===d)throw r.splice(0,h(r,c)),new Error("Cyclic dependency: "+r.join(" -> "));if(s[c]=d,I(a))q.push(c,[function(){return b.get(a)}],j);else{var e=b.annotate(a);L(e,function(a){a!==c&&i.hasOwnProperty(a)&&n(i[a],a)}),q.push(c,a,e)}r.pop(),s[c]=f}}function o(a){return J(a)&&a.then&&a.$$promises}if(!J(i))throw new Error("'invocables' must be an object");var p=g(i||{}),q=[],r=[],s={};return L(i,n),i=r=s=null,function(d,f,g){function h(){--u||(v||e(t,f.$$values),r.$$values=t,r.$$promises=r.$$promises||!0,delete r.$$inheritedValues,n.resolve(t))}function i(a){r.$$failure=a,n.reject(a)}function j(c,e,f){function j(a){l.reject(a),i(a)}function k(){if(!G(r.$$failure))try{l.resolve(b.invoke(e,g,t)),l.promise.then(function(a){t[c]=a,h()},j)}catch(a){j(a)}}var l=a.defer(),m=0;L(f,function(a){s.hasOwnProperty(a)&&!d.hasOwnProperty(a)&&(m++,s[a].then(function(b){t[a]=b,--m||k()},j))}),m||k(),s[c]=l.promise}if(o(d)&&g===c&&(g=f,f=d,d=null),d){if(!J(d))throw new Error("'locals' must be an object")}else d=k;if(f){if(!o(f))throw new Error("'parent' must be a promise returned by $resolve.resolve()")}else f=m;var n=a.defer(),r=n.promise,s=r.$$promises={},t=M({},d),u=1+q.length/3,v=!1;if(G(f.$$failure))return i(f.$$failure),r;f.$$inheritedValues&&e(t,l(f.$$inheritedValues,p)),M(s,f.$$promises),f.$$values?(v=e(t,l(f.$$values,p)),r.$$inheritedValues=l(f.$$values,p),h()):(f.$$inheritedValues&&(r.$$inheritedValues=l(f.$$inheritedValues,p)),f.then(h,i));for(var w=0,x=q.length;x>w;w+=3)d.hasOwnProperty(q[w])?h():j(q[w],q[w+1],q[w+2]);return r}},this.resolve=function(a,b,c,d){return this.study(a)(b,c,d)}}function p(a,b,c){this.fromConfig=function(a,b,c){return G(a.template)?this.fromString(a.template,b):G(a.templateUrl)?this.fromUrl(a.templateUrl,b):G(a.templateProvider)?this.fromProvider(a.templateProvider,b,c):null},this.fromString=function(a,b){return H(a)?a(b):a},this.fromUrl=function(c,d){return H(c)&&(c=c(d)),null==c?null:a.get(c,{cache:b,headers:{Accept:"text/html"}}).then(function(a){return a.data})},this.fromProvider=function(a,b,d){return c.invoke(a,null,d||{params:b})}}function q(a,b,e){function f(b,c,d,e){if(o[b])return o[b];if(!/^\w+(-+\w+)*(?:\[\])?$/.test(b))throw new Error("Invalid parameter name '"+b+"' in pattern '"+a+"'");if(p[b])throw new Error("Duplicate parameter name '"+b+"' in pattern '"+a+"'");return p[b]=new O.Param(b,c,d,e),p[b]}function g(a,b,c){var d=["",""],e=a.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&");if(!b)return e;switch(c){case!1:d=["(",")"];break;case!0:d=["?(",")?"];break;default:d=["("+c+"|",")?"]}return e+d[0]+b+d[1]}function h(c,e){var f,g,h,i,j;return f=c[2]||c[3],j=b.params[f],h=a.substring(m,c.index),g=e?c[4]:c[4]||("*"==c[1]?".*":null),i=O.type(g||"string")||d(O.type("string"),{pattern:new RegExp(g)}),{id:f,regexp:g,segment:h,type:i,cfg:j}}b=M({params:{}},J(b)?b:{});var i,j=/([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,k=/([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,l="^",m=0,n=this.segments=[],o=e?e.params:{},p=this.params=e?e.params.$$new():new O.ParamSet;this.source=a;for(var q,r,s;(i=j.exec(a))&&(q=h(i,!1),!(q.segment.indexOf("?")>=0));)r=f(q.id,q.type,q.cfg,"path"),l+=g(q.segment,r.type.pattern.source,r.squash),n.push(q.segment),m=j.lastIndex;s=a.substring(m);var t=s.indexOf("?");if(t>=0){var u=this.sourceSearch=s.substring(t);if(s=s.substring(0,t),this.sourcePath=a.substring(0,m+t),u.length>0)for(m=0;i=k.exec(u);)q=h(i,!0),r=f(q.id,q.type,q.cfg,"search"),m=j.lastIndex}else this.sourcePath=a,this.sourceSearch="";l+=g(s)+(b.strict===!1?"/?":"")+"$",n.push(s),this.regexp=new RegExp(l,b.caseInsensitive?"i":c),this.prefix=n[0]}function r(a){M(this,a)}function s(){function a(a){return null!=a?a.toString().replace("/","%2F"):a}function e(a){return null!=a?a.toString().replace("%2F","/"):a}function f(a){return this.pattern.test(a)}function i(){return{strict:t,caseInsensitive:p}}function j(a){return H(a)||K(a)&&H(a[a.length-1])}function k(){for(;x.length;){var a=x.shift();if(a.pattern)throw new Error("You cannot override a type's .pattern at runtime.");b.extend(v[a.name],o.invoke(a.def))}}function l(a){M(this,a||{})}O=this;var o,p=!1,t=!0,u=!1,v={},w=!0,x=[],y={string:{encode:a,decode:e,is:f,pattern:/[^/]*/},"int":{encode:a,decode:function(a){return parseInt(a,10)},is:function(a){return G(a)&&this.decode(a.toString())===a},pattern:/\d+/},bool:{encode:function(a){return a?1:0},decode:function(a){return 0!==parseInt(a,10)},is:function(a){return a===!0||a===!1},pattern:/0|1/},date:{encode:function(a){return[a.getFullYear(),("0"+(a.getMonth()+1)).slice(-2),("0"+a.getDate()).slice(-2)].join("-")},decode:function(a){return new Date(a)},is:function(a){return a instanceof Date&&!isNaN(a.valueOf())},equals:function(a,b){return a.toISOString()===b.toISOString()},pattern:/[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/}};s.$$getDefaultValue=function(a){if(!j(a.value))return a.value;if(!o)throw new Error("Injectable functions cannot be called at configuration time");return o.invoke(a.value)},this.caseInsensitive=function(a){return G(a)&&(p=a),p},this.strictMode=function(a){return G(a)&&(t=a),t},this.defaultSquashPolicy=function(a){if(!G(a))return u;if(a!==!0&&a!==!1&&!I(a))throw new Error("Invalid squash policy: "+a+". Valid policies: false, true, arbitrary-string");return u=a,a},this.compile=function(a,b){return new q(a,M(i(),b))},this.isMatcher=function(a){if(!J(a))return!1;var b=!0;return L(q.prototype,function(c,d){H(c)&&(b=b&&G(a[d])&&H(a[d]))}),b},this.type=function(a,b,c){if(!G(b))return v[a];if(v.hasOwnProperty(a))throw new Error("A type named '"+a+"' has already been defined.");return v[a]=new r(M({name:a},b)),c&&(x.push({name:a,def:c}),w||k()),this},L(y,function(a,b){v[b]=new r(M({name:b},a))}),v=d(v,{}),this.$get=["$injector",function(a){return o=a,w=!1,k(),L(y,function(a,b){v[b]||(v[b]=new r(a))}),this}],this.Param=function(a,b,d,e){function f(a){var b=J(a)?g(a):[],c=-1===h(b,"value")&&-1===h(b,"type")&&-1===h(b,"squash")&&-1===h(b,"array"),d=c?a:a.value,e={fn:j(d)?d:function(){return e.value},value:d};return e}function i(b,c){if(b.type&&c)throw new Error("Param '"+a+"' has two type configurations.");return c?c:b.type?b.type instanceof r?b.type:new r(b.type):v.string}function k(){var b={array:"search"===e?"auto":!1},c=a.match(/\[\]$/)?{array:!0}:{};return M(b,c,d).array}function l(a,b){var c=a.squash;if(!b||c===!1)return!1;if(!G(c)||null==c)return u;if(c===!0||I(c))return c;throw new Error("Invalid squash policy: '"+c+"'. Valid policies: false, true, or arbitrary string")}function p(a,b,d,e){var f,g,i=[{from:"",to:d||b?c:""},{from:null,to:d||b?c:""}];return f=K(a.replace)?a.replace:[],I(e)&&f.push({from:e,to:c}),g=n(f,function(a){return a.from}),m(i,function(a){return-1===h(g,a.from)}).concat(f)}function q(){if(!o)throw new Error("Injectable functions cannot be called at configuration time");return o.invoke(x.fn)}function s(a){function b(a){return function(b){return b.from===a}}function c(a){var c=n(m(w.replace,b(a)),function(a){return a.to});return c.length?c[0]:a}return a=c(a),G(a)?w.type.decode(a):q()}function t(){return"{Param:"+a+" "+b+" squash: '"+A+"' optional: "+z+"}"}var w=this,x=f(d);d=d||{},b=i(d,b);var y=k();b=y?b.$asArray(y,"search"===e):b,"string"!==b.name||y||"path"!==e||x.value!==c||(x.value="");var z=x.value!==c,A=l(d,z),B=p(d,y,z,A);M(this,{id:a,type:b,array:y,config:d,squash:A,replace:B,isOptional:z,dynamic:c,value:s,toString:t})},l.prototype={$$new:function(){return d(this,M(new l,{$$parent:this}))},$$keys:function(){for(var a=[],b=[],c=this,d=g(l.prototype);c;)b.push(c),c=c.$$parent;return b.reverse(),L(b,function(b){L(g(b),function(b){-1===h(a,b)&&-1===h(d,b)&&a.push(b)})}),a},$$values:function(a){var b={},c=this;return L(c.$$keys(),function(d){b[d]=c[d].value(a&&a[d])}),b},$$equals:function(a,b){var c=!0,d=this;return L(d.$$keys(),function(e){var f=a&&a[e],g=b&&b[e];d[e].type.equals(f,g)||(c=!1)}),c},$$validates:function(a){var b,c,d,e=!0,f=this;return L(this.$$keys(),function(g){d=f[g],c=a[g],b=!c&&d.isOptional,e=e&&(b||d.type.is(c))}),e},$$parent:c},this.ParamSet=l}function t(a,d){function e(a){var b=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);return null!=b?b[1].replace(/\\(.)/g,"$1"):""}function f(a,b){return a.replace(/\$(\$|\d{1,2})/,function(a,c){return b["$"===c?0:Number(c)]})}function g(a,b,c){if(!c)return!1;var d=a.invoke(b,b,{$match:c});return G(d)?d:!0}function h(c,d,e,f){function g(a,b,c){return"/"===n?a:b?n.slice(0,-1)+a:c?n.slice(1)+a:a}function h(a){function b(a){var b=a(e,c);return b?(I(b)&&c.replace().url(b),!0):!1}if(!a||!a.defaultPrevented){var d,f=j.length;for(d=0;f>d;d++)if(b(j[d]))return;k&&b(k)}}function m(){return i=i||d.$on("$locationChangeSuccess",h)}var n=f.baseHref(),o=c.url();return l||m(),{sync:function(){h()},listen:function(){return m()},update:function(a){return a?void(o=c.url()):void(c.url()!==o&&(c.url(o),c.replace()))},push:function(a,b,d){c.url(a.format(b||{})),d&&d.replace&&c.replace()},href:function(d,e,f){if(!d.validates(e))return null;var h=a.html5Mode();b.isObject(h)&&(h=h.enabled);var i=d.format(e);if(f=f||{},h||null===i||(i="#"+a.hashPrefix()+i),i=g(i,h,f.absolute),!f.absolute||!i)return i;var j=!h&&i?"/":"",k=c.port();return k=80===k||443===k?"":":"+k,[c.protocol(),"://",c.host(),k,j,i].join("")}}}var i,j=[],k=null,l=!1;this.rule=function(a){if(!H(a))throw new Error("'rule' must be a function");return j.push(a),this},this.otherwise=function(a){if(I(a)){var b=a;a=function(){return b}}else if(!H(a))throw new Error("'rule' must be a function");return k=a,this},this.when=function(a,b){var c,h=I(b);if(I(a)&&(a=d.compile(a)),!h&&!H(b)&&!K(b))throw new Error("invalid 'handler' in when()");var i={matcher:function(a,b){return h&&(c=d.compile(b),b=["$match",function(a){return c.format(a)}]),M(function(c,d){return g(c,b,a.exec(d.path(),d.search()))},{prefix:I(a.prefix)?a.prefix:""})},regex:function(a,b){if(a.global||a.sticky)throw new Error("when() RegExp must not be global or sticky");return h&&(c=b,b=["$match",function(a){return f(c,a)}]),M(function(c,d){return g(c,b,a.exec(d.path()))},{prefix:e(a)})}},j={matcher:d.isMatcher(a),regex:a instanceof RegExp};for(var k in j)if(j[k])return this.rule(i[k](a,b));throw new Error("invalid 'what' in when()")},this.deferIntercept=function(a){a===c&&(a=!0),l=a},this.$get=h,h.$inject=["$location","$rootScope","$injector","$browser"]}function u(a,e){function f(a){return 0===a.indexOf(".")||0===a.indexOf("^")}function l(a,b){if(!a)return c;var d=I(a),e=d?a:a.name,g=f(e);if(g){if(!b)throw new Error("No reference point given for path '"+e+"'");b=l(b);for(var h=e.split("."),i=0,j=h.length,k=b;j>i;i++)if(""!==h[i]||0!==i){if("^"!==h[i])break;if(!k.parent)throw new Error("Path '"+e+"' not valid for state '"+b.name+"'");k=k.parent}else k=b;h=h.slice(i).join("."),e=k.name+(k.name&&h?".":"")+h}var m=y[e];return!m||!d&&(d||m!==a&&m.self!==a)?c:m}function m(a,b){z[a]||(z[a]=[]),z[a].push(b)}function o(a){for(var b=z[a]||[];b.length;)p(b.shift())}function p(b){b=d(b,{self:b,resolve:b.resolve||{},toString:function(){return this.name}});var c=b.name;if(!I(c)||c.indexOf("@")>=0)throw new Error("State must have a valid name");if(y.hasOwnProperty(c))throw new Error("State '"+c+"'' is already defined");var e=-1!==c.indexOf(".")?c.substring(0,c.lastIndexOf(".")):I(b.parent)?b.parent:J(b.parent)&&I(b.parent.name)?b.parent.name:"";if(e&&!y[e])return m(e,b.self);for(var f in B)H(B[f])&&(b[f]=B[f](b,B.$delegates[f]));return y[c]=b,!b[A]&&b.url&&a.when(b.url,["$match","$stateParams",function(a,c){x.$current.navigable==b&&j(a,c)||x.transitionTo(b,a,{location:!1})}]),o(c),b}function q(a){return a.indexOf("*")>-1}function r(a){var b=a.split("."),c=x.$current.name.split(".");if("**"===b[0]&&(c=c.slice(h(c,b[1])),c.unshift("**")),"**"===b[b.length-1]&&(c.splice(h(c,b[b.length-2])+1,Number.MAX_VALUE),c.push("**")),b.length!=c.length)return!1;for(var d=0,e=b.length;e>d;d++)"*"===b[d]&&(c[d]="*");return c.join("")===b.join("")}function s(a,b){return I(a)&&!G(b)?B[a]:H(b)&&I(a)?(B[a]&&!B.$delegates[a]&&(B.$delegates[a]=B[a]),B[a]=b,this):this}function t(a,b){return J(a)?b=a:b.name=a,p(b),this}function u(a,e,f,h,m,o,p){function s(b,c,d,f){var g=a.$broadcast("$stateNotFound",b,c,d);if(g.defaultPrevented)return p.update(),B;if(!g.retry)return null;if(f.$retry)return p.update(),C;var h=x.transition=e.when(g.retry);return h.then(function(){return h!==x.transition?u:(b.options.$retry=!0,x.transitionTo(b.to,b.toParams,b.options))},function(){return B}),p.update(),h}function t(a,c,d,g,i,j){var l=d?c:k(a.params.$$keys(),c),n={$stateParams:l};i.resolve=m.resolve(a.resolve,n,i.resolve,a);var o=[i.resolve.then(function(a){i.globals=a})];return g&&o.push(g),L(a.views,function(c,d){var e=c.resolve&&c.resolve!==a.resolve?c.resolve:{};e.$template=[function(){return f.load(d,{view:c,locals:n,params:l,notify:j.notify})||""}],o.push(m.resolve(e,n,i.resolve,a).then(function(f){if(H(c.controllerProvider)||K(c.controllerProvider)){var g=b.extend({},e,n);f.$$controller=h.invoke(c.controllerProvider,null,g)}else f.$$controller=c.controller;f.$$state=a,f.$$controllerAs=c.controllerAs,i[d]=f}))}),e.all(o).then(function(){return i})}var u=e.reject(new Error("transition superseded")),z=e.reject(new Error("transition prevented")),B=e.reject(new Error("transition aborted")),C=e.reject(new Error("transition failed"));return w.locals={resolve:null,globals:{$stateParams:{}}},x={params:{},current:w.self,$current:w,transition:null},x.reload=function(){return x.transitionTo(x.current,o,{reload:!0,inherit:!1,notify:!0})},x.go=function(a,b,c){return x.transitionTo(a,b,M({inherit:!0,relative:x.$current},c))},x.transitionTo=function(b,c,f){c=c||{},f=M({location:!0,inherit:!1,relative:null,notify:!0,reload:!1,$retry:!1},f||{});var g,j=x.$current,m=x.params,n=j.path,q=l(b,f.relative);if(!G(q)){var r={to:b,toParams:c,options:f},y=s(r,j.self,m,f);if(y)return y;if(b=r.to,c=r.toParams,f=r.options,q=l(b,f.relative),!G(q)){if(!f.relative)throw new Error("No such state '"+b+"'");throw new Error("Could not resolve '"+b+"' from state '"+f.relative+"'")}}if(q[A])throw new Error("Cannot transition to abstract state '"+b+"'");if(f.inherit&&(c=i(o,c||{},x.$current,q)),!q.params.$$validates(c))return C;c=q.params.$$values(c),b=q;var B=b.path,D=0,E=B[D],F=w.locals,H=[];if(!f.reload)for(;E&&E===n[D]&&E.ownParams.$$equals(c,m);)F=H[D]=E.locals,D++,E=B[D];if(v(b,j,F,f))return b.self.reloadOnSearch!==!1&&p.update(),x.transition=null,e.when(x.current);if(c=k(b.params.$$keys(),c||{}),f.notify&&a.$broadcast("$stateChangeStart",b.self,c,j.self,m).defaultPrevented)return p.update(),z;for(var I=e.when(F),J=D;J<B.length;J++,E=B[J])F=H[J]=d(F),I=t(E,c,E===b,I,F,f);var K=x.transition=I.then(function(){var d,e,g;if(x.transition!==K)return u;for(d=n.length-1;d>=D;d--)g=n[d],g.self.onExit&&h.invoke(g.self.onExit,g.self,g.locals.globals),g.locals=null;for(d=D;d<B.length;d++)e=B[d],e.locals=H[d],e.self.onEnter&&h.invoke(e.self.onEnter,e.self,e.locals.globals);return x.transition!==K?u:(x.$current=b,x.current=b.self,x.params=c,N(x.params,o),x.transition=null,f.location&&b.navigable&&p.push(b.navigable.url,b.navigable.locals.globals.$stateParams,{replace:"replace"===f.location}),f.notify&&a.$broadcast("$stateChangeSuccess",b.self,c,j.self,m),p.update(!0),x.current)},function(d){return x.transition!==K?u:(x.transition=null,g=a.$broadcast("$stateChangeError",b.self,c,j.self,m,d),g.defaultPrevented||p.update(),e.reject(d))});return K},x.is=function(a,d,e){e=M({relative:x.$current},e||{});var f=l(a,e.relative);return G(f)?x.$current!==f?!1:G(d)&&null!==d?b.equals(o,d):!0:c},x.includes=function(a,b,d){if(d=M({relative:x.$current},d||{}),I(a)&&q(a)){if(!r(a))return!1;a=x.$current.name}var e=l(a,d.relative);return G(e)?G(x.$current.includes[e.name])?j(b,o):!1:c},x.href=function(a,b,d){d=M({lossy:!0,inherit:!0,absolute:!1,relative:x.$current},d||{});var e=l(a,d.relative);if(!G(e))return null;d.inherit&&(b=i(o,b||{},x.$current,e));var f=e&&d.lossy?e.navigable:e;return f&&f.url!==c&&null!==f.url?p.href(f.url,k(e.params.$$keys(),b||{}),{absolute:d.absolute}):null},x.get=function(a,b){if(0===arguments.length)return n(g(y),function(a){return y[a].self});var c=l(a,b||x.$current);return c&&c.self?c.self:null},x}function v(a,b,c,d){return a!==b||(c!==b.locals||d.reload)&&a.self.reloadOnSearch!==!1?void 0:!0}var w,x,y={},z={},A="abstract",B={parent:function(a){if(G(a.parent)&&a.parent)return l(a.parent);var b=/^(.+)\.[^.]+$/.exec(a.name);return b?l(b[1]):w},data:function(a){return a.parent&&a.parent.data&&(a.data=a.self.data=M({},a.parent.data,a.data)),a.data},url:function(a){var b=a.url,c={params:a.params||{}};if(I(b))return"^"==b.charAt(0)?e.compile(b.substring(1),c):(a.parent.navigable||w).url.concat(b,c);if(!b||e.isMatcher(b))return b;throw new Error("Invalid url '"+b+"' in state '"+a+"'")},navigable:function(a){return a.url?a:a.parent?a.parent.navigable:null},ownParams:function(a){var b=a.url&&a.url.params||new O.ParamSet;return L(a.params||{},function(a,c){b[c]||(b[c]=new O.Param(c,null,a))}),b},params:function(a){return a.parent&&a.parent.params?M(a.parent.params.$$new(),a.ownParams):new O.ParamSet},views:function(a){var b={};return L(G(a.views)?a.views:{"":a},function(c,d){d.indexOf("@")<0&&(d+="@"+a.parent.name),b[d]=c}),b},path:function(a){return a.parent?a.parent.path.concat(a):[]},includes:function(a){var b=a.parent?M({},a.parent.includes):{};return b[a.name]=!0,b},$delegates:{}};w=p({name:"",url:"^",views:null,"abstract":!0}),w.navigable=null,this.decorator=s,this.state=t,this.$get=u,u.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$urlRouter","$location","$urlMatcherFactory"]}function v(){function a(a,b){return{load:function(c,d){var e,f={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return d=M(f,d),d.view&&(e=b.fromConfig(d.view,d.params,d.locals)),e&&d.notify&&a.$broadcast("$viewContentLoading",d),e}}}this.$get=a,a.$inject=["$rootScope","$templateFactory"]}function w(){var a=!1;this.useAnchorScroll=function(){a=!0},this.$get=["$anchorScroll","$timeout",function(b,c){return a?b:function(a){c(function(){a[0].scrollIntoView()},0,!1)}}]}function x(a,c,d,e){function f(){return c.has?function(a){return c.has(a)?c.get(a):null}:function(a){try{return c.get(a)}catch(b){return null}}}function g(a,b){var c=function(){return{enter:function(a,b,c){b.after(a),c()},leave:function(a,b){a.remove(),b()}}};if(j)return{enter:function(a,b,c){var d=j.enter(a,null,b,c);d&&d.then&&d.then(c)},leave:function(a,b){var c=j.leave(a,b);c&&c.then&&c.then(b)}};if(i){var d=i&&i(b,a);return{enter:function(a,b,c){d.enter(a,null,b),c()},leave:function(a,b){d.leave(a),b()}}}return c()}var h=f(),i=h("$animator"),j=h("$animate"),k={restrict:"ECA",terminal:!0,priority:400,transclude:"element",compile:function(c,f,h){return function(c,f,i){function j(){l&&(l.remove(),l=null),n&&(n.$destroy(),n=null),m&&(r.leave(m,function(){l=null}),l=m,m=null)}function k(g){var k,l=z(c,i,f,e),s=l&&a.$current&&a.$current.locals[l];if(g||s!==o){k=c.$new(),o=a.$current.locals[l];var t=h(k,function(a){r.enter(a,f,function(){n&&n.$emit("$viewContentAnimationEnded"),(b.isDefined(q)&&!q||c.$eval(q))&&d(a)}),j()});m=t,n=k,n.$emit("$viewContentLoaded"),n.$eval(p)}}var l,m,n,o,p=i.onload||"",q=i.autoscroll,r=g(i,c);c.$on("$stateChangeSuccess",function(){k(!1)}),c.$on("$viewContentLoading",function(){k(!1)}),k(!0)}}};return k}function y(a,b,c,d){return{restrict:"ECA",priority:-400,compile:function(e){var f=e.html();return function(e,g,h){var i=c.$current,j=z(e,h,g,d),k=i&&i.locals[j];if(k){g.data("$uiView",{name:j,state:k.$$state}),g.html(k.$template?k.$template:f);var l=a(g.contents());if(k.$$controller){k.$scope=e;var m=b(k.$$controller,k);k.$$controllerAs&&(e[k.$$controllerAs]=m),g.data("$ngControllerController",m),g.children().data("$ngControllerController",m)}l(e)}}}}}function z(a,b,c,d){var e=d(b.uiView||b.name||"")(a),f=c.inheritedData("$uiView");return e.indexOf("@")>=0?e:e+"@"+(f?f.state.name:"")}function A(a,b){var c,d=a.match(/^\s*({[^}]*})\s*$/);if(d&&(a=b+"("+d[1]+")"),c=a.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!c||4!==c.length)throw new Error("Invalid state ref '"+a+"'");return{state:c[1],paramExpr:c[3]||null}}function B(a){var b=a.parent().inheritedData("$uiView");return b&&b.state&&b.state.name?b.state:void 0}function C(a,c){var d=["location","inherit","reload"];return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(e,f,g,h){var i=A(g.uiSref,a.current.name),j=null,k=B(f)||a.$current,l=null,m="A"===f.prop("tagName"),n="FORM"===f[0].nodeName,o=n?"action":"href",p=!0,q={relative:k,inherit:!0},r=e.$eval(g.uiSrefOpts)||{};b.forEach(d,function(a){a in r&&(q[a]=r[a])});var s=function(c){if(c&&(j=b.copy(c)),p){l=a.href(i.state,j,q);var d=h[1]||h[0];return d&&d.$$setStateInfo(i.state,j),null===l?(p=!1,!1):void g.$set(o,l)}};i.paramExpr&&(e.$watch(i.paramExpr,function(a){a!==j&&s(a)},!0),j=b.copy(e.$eval(i.paramExpr))),s(),n||f.bind("click",function(b){var d=b.which||b.button;if(!(d>1||b.ctrlKey||b.metaKey||b.shiftKey||f.attr("target"))){var e=c(function(){a.go(i.state,j,q)});b.preventDefault();var g=m&&!l?1:0;b.preventDefault=function(){g--<=0&&c.cancel(e)}}})}}}function D(a,b,c){return{restrict:"A",controller:["$scope","$element","$attrs",function(d,e,f){function g(){h()?e.addClass(m):e.removeClass(m)}function h(){return"undefined"!=typeof f.uiSrefActiveEq?a.$current.self===k&&i():k&&a.includes(k.name)&&i()}function i(){return!l||j(l,b)}var k,l,m;m=c(f.uiSrefActiveEq||f.uiSrefActive||"",!1)(d),this.$$setStateInfo=function(b,c){k=a.get(b,B(e)),l=c,g()},d.$on("$stateChangeSuccess",g)}]}}function E(a){var b=function(b){return a.is(b)};return b.$stateful=!0,b}function F(a){var b=function(b){return a.includes(b)};return b.$stateful=!0,b}var G=b.isDefined,H=b.isFunction,I=b.isString,J=b.isObject,K=b.isArray,L=b.forEach,M=b.extend,N=b.copy;b.module("ui.router.util",["ng"]),b.module("ui.router.router",["ui.router.util"]),b.module("ui.router.state",["ui.router.router","ui.router.util"]),b.module("ui.router",["ui.router.state"]),b.module("ui.router.compat",["ui.router"]),o.$inject=["$q","$injector"],b.module("ui.router.util").service("$resolve",o),p.$inject=["$http","$templateCache","$injector"],b.module("ui.router.util").service("$templateFactory",p);var O;q.prototype.concat=function(a,b){var c={caseInsensitive:O.caseInsensitive(),strict:O.strictMode(),squash:O.defaultSquashPolicy()};return new q(this.sourcePath+a+this.sourceSearch,M(c,b),this)},q.prototype.toString=function(){return this.source},q.prototype.exec=function(a,b){function c(a){function b(a){return a.split("").reverse().join("")}function c(a){return a.replace(/\\-/,"-")}var d=b(a).split(/-(?!\\)/),e=n(d,b);return n(e,c).reverse()}var d=this.regexp.exec(a);if(!d)return null;b=b||{};var e,f,g,h=this.parameters(),i=h.length,j=this.segments.length-1,k={};if(j!==d.length-1)throw new Error("Unbalanced capture group in route '"+this.source+"'");for(e=0;j>e;e++){g=h[e];var l=this.params[g],m=d[e+1];for(f=0;f<l.replace;f++)l.replace[f].from===m&&(m=l.replace[f].to);m&&l.array===!0&&(m=c(m)),k[g]=l.value(m)}for(;i>e;e++)g=h[e],k[g]=this.params[g].value(b[g]);return k},q.prototype.parameters=function(a){return G(a)?this.params[a]||null:this.params.$$keys()},q.prototype.validates=function(a){return this.params.$$validates(a)},q.prototype.format=function(a){function b(a){return encodeURIComponent(a).replace(/-/g,function(a){return"%5C%"+a.charCodeAt(0).toString(16).toUpperCase()})}a=a||{};var c=this.segments,d=this.parameters(),e=this.params;if(!this.validates(a))return null;var f,g=!1,h=c.length-1,i=d.length,j=c[0];for(f=0;i>f;f++){var k=h>f,l=d[f],m=e[l],o=m.value(a[l]),p=m.isOptional&&m.type.equals(m.value(),o),q=p?m.squash:!1,r=m.type.encode(o);if(k){var s=c[f+1];if(q===!1)null!=r&&(j+=K(r)?n(r,b).join("-"):encodeURIComponent(r)),j+=s;else if(q===!0){var t=j.match(/\/$/)?/\/?(.*)/:/(.*)/;j+=s.match(t)[1]}else I(q)&&(j+=q+s)}else{if(null==r||p&&q!==!1)continue;K(r)||(r=[r]),r=n(r,encodeURIComponent).join("&"+l+"="),j+=(g?"&":"?")+(l+"="+r),g=!0}}return j},r.prototype.is=function(){return!0},r.prototype.encode=function(a){return a},r.prototype.decode=function(a){return a},r.prototype.equals=function(a,b){return a==b},r.prototype.$subPattern=function(){var a=this.pattern.toString();return a.substr(1,a.length-2)},r.prototype.pattern=/.*/,r.prototype.toString=function(){return"{Type:"+this.name+"}"},r.prototype.$asArray=function(a,b){function c(a,b){function c(a,b){return function(){return b.apply(a,arguments)}}function d(a,c){return function(d){K(d)||(d=[d]);var e=n(d,a);return c?e.reduce(c,!0):e&&1==e.length&&"auto"===b?e[0]:e}}function e(a,b){return a&&b}this.encode=d(c(this,a.encode)),this.decode=d(c(this,a.decode)),this.equals=d(c(this,a.equals),e),this.is=d(c(this,a.is),e),this.pattern=a.pattern,this.$arrayMode=b}if(!a)return this;if("auto"===a&&!b)throw new Error("'auto' array mode is for query parameters only");return new c(this,a)},b.module("ui.router.util").provider("$urlMatcherFactory",s),b.module("ui.router.util").run(["$urlMatcherFactory",function(){}]),t.$inject=["$locationProvider","$urlMatcherFactoryProvider"],b.module("ui.router.router").provider("$urlRouter",t),u.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider"],b.module("ui.router.state").value("$stateParams",{}).provider("$state",u),v.$inject=[],b.module("ui.router.state").provider("$view",v),b.module("ui.router.state").provider("$uiViewScroll",w),x.$inject=["$state","$injector","$uiViewScroll","$interpolate"],y.$inject=["$compile","$controller","$state","$interpolate"],b.module("ui.router.state").directive("uiView",x),b.module("ui.router.state").directive("uiView",y),C.$inject=["$state","$timeout"],D.$inject=["$state","$stateParams","$interpolate"],b.module("ui.router.state").directive("uiSref",C).directive("uiSrefActive",D).directive("uiSrefActiveEq",D),E.$inject=["$state"],F.$inject=["$state"],b.module("ui.router.state").filter("isState",E).filter("includedByState",F)}(window,window.angular);