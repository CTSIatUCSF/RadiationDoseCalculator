angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, UserDataService, StoredDataService) {

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
        plaintext += addPadding($scope.edeTotal("CT"), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("CT"), opt.col5 - opt.col4);
        plaintext += addPadding($scope.edeAnnualTotal("CT"), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Nuclear Medicine " + footnotePlainText("NM"), opt.col2);
        plaintext += addPadding($scope.getScanCount("NM"), opt.col3 - opt.col2);
        plaintext += addPadding($scope.edeTotal("NM"), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("NM"), opt.col5 - opt.col4);
        plaintext += addPadding($scope.edeAnnualTotal("NM"), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Radiography " + footnotePlainText("XRay"), opt.col2);
        plaintext += addPadding($scope.getScanCount("XRay"), opt.col3 - opt.col2);
        plaintext += addPadding($scope.edeTotal("XRay"), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("XRay"), opt.col5 - opt.col4);
        plaintext += addPadding($scope.edeAnnualTotal("XRay"), opt.col6 - opt.col5);
        plaintext += "\n";

        plaintext += addPadding("Flouroscopy " + footnotePlainText("Flouro"), opt.col2);
        plaintext += addPadding($scope.getScanCount("Flouro"), opt.col3 - opt.col2);
        plaintext += addPadding($scope.edeTotal("Flouro"), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("Flouro"), opt.col5 - opt.col4);
        plaintext += addPadding($scope.edeAnnualTotal("Flouro"), opt.col6 - opt.col5);
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
        plaintext += addPadding($scope.edeReportTotalWithoutSOC(), opt.col3 - opt.col2);
        plaintext += addPadding($scope.edeReportAnnualTotalWithoutSOC(), opt.col4 - opt.col3);
        plaintext += "\n";

        plaintext += addPadding("Standard of Care (mSv)", opt.col2);
        plaintext += addPadding($scope.edeReportTotalOnlySOC(), opt.col3 - opt.col2);
        plaintext += addPadding($scope.edeReportAnnualTotalOnlySOC(), opt.col4 - opt.col3);
        plaintext += "\n";

        plaintext += addPadding("Total EDE (mSv)", opt.col2);
        plaintext += addPadding($scope.edeReportTotal(), opt.col3 - opt.col2);
        plaintext += addPadding($scope.edeReportAnnualTotal(), opt.col4 - opt.col3);
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
});