angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, UserDataService, StoredDataService) {

    var storedData = StoredDataService.storedData();
    var userData   = UserDataService.getAllProcedures();
    var plainTextFormattingOptions = {
        "col1":1,
        "col2":30,
        "col3":50,
        "col4":85
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

        console.log("bibliography:");
        console.log(bibliography);

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
        var edeLabelText = "EDE (mSv)";

        var plaintext = "\n";
        plaintext += "Radiation Dose Calculator\n";
        plaintext += "\n";

        plaintext += addPadding("Types of Procedures", opt.col2);
        plaintext += addPadding("Number of Scans", opt.col3 - opt.col2);
        plaintext += edeLabelText + "\n";

        plaintext += addPadding("", opt.col3 + edeLabelText.length, "-");
        plaintext += "\n";

        plaintext += addPadding("X-Ray CT " + footnotePlainText("CT"), opt.col2);
        plaintext += addPadding($scope.getScanCount("CT"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("CT") + "\n";

        plaintext += addPadding("Nuclear Medicine " + footnotePlainText("NM"), opt.col2);
        plaintext += addPadding($scope.getScanCount("NM"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("NM") + "\n";

        plaintext += addPadding("Radiography " + footnotePlainText("XRay"), opt.col2);
        plaintext += addPadding($scope.getScanCount("XRay"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("XRay") + "\n";

        plaintext += addPadding("Flouroscopy " + footnotePlainText("Flouro"), opt.col2);
        plaintext += addPadding($scope.getScanCount("Flouro"), opt.col3 - opt.col2);
        plaintext += $scope.edeTotal("Flouro") + "\n";

        plaintext += "\n";
        plaintext += addPadding("", opt.col3 + edeLabelText.length, "-");
        plaintext += "\n";

        plaintext += addPadding("Research EDE (mSv)", opt.col3);
        plaintext += $scope.edeReportTotalWithoutSOC() + "\n";

        plaintext += addPadding("Standard of Care (mSv)", opt.col3);
        plaintext += $scope.edeReportTotalOnlySOC() + "\n";

        plaintext += addPadding("Total EDE (mSv)", opt.col3);
        plaintext += $scope.edeReportTotal() + "\n";

        plaintext += "\n";
        plaintext += addPadding("", opt.col3 + edeLabelText.length, "-");
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