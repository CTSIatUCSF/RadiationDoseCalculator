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
        var categoryIds = ["CT", "NM", "XRay", "Fluoro"];
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

    $scope.plainTextTables = function() {
        var opt = plainTextFormattingOptions;
        var edeLabelText = "EDE(mSv)";
        var linebreak = "\n";

        var plaintext = "";
        plaintext += linebreak;

        plaintext += addPadding(" ", opt.col2);
        plaintext += addPadding("Total", opt.col3 - opt.col2);
        plaintext += addPadding("Total", opt.col4 - opt.col3);
        plaintext += addPadding("Annual", opt.col5 - opt.col4);
        plaintext += addPadding("Annual", opt.col6 - opt.col5);
        plaintext += linebreak;

        plaintext += addPadding("Types of Procedures", opt.col2);
        plaintext += addPadding("Scans", opt.col3 - opt.col2);
        plaintext += addPadding(edeLabelText, opt.col4 - opt.col3);
        plaintext += addPadding("Scans", opt.col5 - opt.col4);
        plaintext += addPadding(edeLabelText, opt.col6 - opt.col5);
        plaintext += linebreak;

        plaintext += addPadding("", opt.col5 + edeLabelText.length, "-");
        plaintext += linebreak;

        plaintext += addPadding("X-Ray CT " + footnotePlainText("CT"), opt.col2);
        plaintext += addPadding($scope.getScanCount("CT"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("CT"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("CT"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("CT"), 2), opt.col6 - opt.col5);
        plaintext += linebreak;

        plaintext += addPadding("Nuclear Medicine " + footnotePlainText("NM"), opt.col2);
        plaintext += addPadding($scope.getScanCount("NM"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("NM"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("NM"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("NM"), 2), opt.col6 - opt.col5);
        plaintext += linebreak;

        plaintext += addPadding("Radiography " + footnotePlainText("XRay"), opt.col2);
        plaintext += addPadding($scope.getScanCount("XRay"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("XRay"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("XRay"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("XRay"), 2), opt.col6 - opt.col5);
        plaintext += linebreak;

        plaintext += addPadding("Fluoroscopy " + footnotePlainText("Fluoro"), opt.col2);
        plaintext += addPadding($scope.getScanCount("Fluoro"), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeTotal("Fluoro"), 2), opt.col4 - opt.col3);
        plaintext += addPadding($scope.getAnnualScanCount("Fluoro"), opt.col5 - opt.col4);
        plaintext += addPadding(decimalFormatter.format($scope.edeAnnualTotal("Fluoro"), 2), opt.col6 - opt.col5);
        plaintext += linebreak;

        plaintext += linebreak;
        plaintext += linebreak;
        plaintext += addPadding(" ", opt.col2);
        plaintext += addPadding("Total", opt.col3 - opt.col2);
        plaintext += addPadding("Annual", opt.col4 - opt.col3);
        plaintext += linebreak;
        plaintext += addPadding("", opt.col5 + edeLabelText.length, "-");
        plaintext += linebreak;

        plaintext += addPadding("Research EDE (mSv)", opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportTotalWithoutSOC(), 2), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportAnnualTotalWithoutSOC(), 2), opt.col4 - opt.col3);
        plaintext += linebreak;

        plaintext += addPadding("Standard of Care (mSv)", opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportTotalOnlySOC(), 2), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportAnnualTotalOnlySOC(), 2), opt.col4 - opt.col3);
        plaintext += linebreak;

        plaintext += addPadding("Total EDE (mSv)", opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportTotal(), 2), opt.col3 - opt.col2);
        plaintext += addPadding(decimalFormatter.format($scope.edeReportAnnualTotal(), 2), opt.col4 - opt.col3);

        return plaintext;
    };

    $scope.getPlainTextCitations = function() {
        return $scope.bibliography.citations;
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