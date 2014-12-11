angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, UserDataService, StoredDataService) {

    var storedData = StoredDataService.storedData();
    var userData   = UserDataService.getAllProcedures();
    var plainTextFormattingOptions = {
        "col1":1,
        "col2":25,
        "col3":45,
        "col4":80
    };
    var comparisonDoseMsv, effectiveDose, convertMsvToRem, convertRemToMsv, comparisonDoseQuotient, addPadding, citationArray;

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

    $scope.citations = function() {
        var citationArray = [];
        var formIndex, form, examIndex, exam, citation;
        // var index = 0;
        if (userData) {
            for (formIndex in userData.formData) {
                form = userData.formData[formIndex];
                for (examIndex in form.exams) {
                    exam = form.exams[examIndex];
                    if (exam.exam) {
                        citation = StoredDataService.getProcedureCitation(form.id, exam.exam);
                        // index++;
                        // citationObject = {"index": index, "citation": citation, "section": form.id};
                        citationArray.push(citation);
                    }
                }
            }
        }
        return citationArray;
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

    $scope.makePlainText = function() {
        var opt = plainTextFormattingOptions;
        var plaintext = "\n";
        plaintext += "Radiation Dose Calculator\n";
        plaintext += "\n";

        plaintext += addPadding("Types of Procedures", opt.col2);
        plaintext += addPadding("Number of Scans", opt.col3 - opt.col2);
        plaintext += "EDE (mSv)\n";

        plaintext += addPadding("", 56, "-");
        plaintext += "\n";

        plaintext += addPadding("X-Ray CT", opt.col2);
        plaintext += addPadding($scope.getScanCount("CT"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("CT") + "\n";

        plaintext += addPadding("Nuclear Medicine", opt.col2);
        plaintext += addPadding($scope.getScanCount("NM"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("NM") + "\n";

        plaintext += addPadding("Radiography", opt.col2);
        plaintext += addPadding($scope.getScanCount("XRay"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("XRay") + "\n";

        plaintext += addPadding("Flouroscopy", opt.col2);
        plaintext += addPadding($scope.getScanCount("Flouro"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("Flouro") + "\n";

        plaintext += "\n";
        plaintext += addPadding("", 56, "-");
        plaintext += "\n";

        plaintext += addPadding("Research EDE (mSv)", opt.col3);
        plaintext += $scope.edeReportTotalWithoutSOC() + "\n";

        plaintext += addPadding("Standard of Care (mSv)", opt.col3);
        plaintext += $scope.edeReportTotalOnlySOC() + "\n";

        plaintext += addPadding("Total EDE (mSv)", opt.col3);
        plaintext += $scope.edeReportTotal() + "\n";

        plaintext += "\n";
        plaintext += addPadding("", 56, "-");
        plaintext += "\n";

        plaintext += addPadding("Comparison Dose (mSv)", opt.col3);
        plaintext += $scope.comparisonDose + "\n";
        plaintext += "\n";

        plaintext += "Comparison Dose Support Language" + "\n";
        plaintext += $scope.comparisonDoseSupportingLanguage + "\n";
        plaintext += "\n";

        plaintext += "Consent Narrative" + "\n";
        plaintext += $scope.consentNarrative + "\n";
        plaintext += "\n";

        plaintext += "Supplemental Consent Language" + "\n";
        plaintext += $scope.supplementalConsentLanguage + "\n";

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

    $scope.getScanCount = function(formId) {
        return UserDataService.getScanCount(formId);
    };

    $scope.edeTotal = function(formId) {
        return UserDataService.edeTotal(formId);
    };

    $scope.edeTotalWithoutSOC = function(formId) {
        return UserDataService.edeTotalWithoutSOC(formId);
    };

    $scope.edeTotalOnlySOC = function(formId) {
        return UserDataService.edeTotalOnlySOC(formId);
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

});