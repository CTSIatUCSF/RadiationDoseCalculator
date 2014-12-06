angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, UserDataService, StoredDataService) {

    var storedData = StoredDataService.storedData();
    var userData = UserDataService.userData();
    var plainTextFormattingOptions = {
        "col1":1,
        "col2":25,
        "col3":45,
        "col4":80
    };

    $scope.consentNarrative = storedData.ConsentNarrative || "";
    $scope.comparisonDoseSupportingLanguage = storedData.ComparisonDoseSupportingLanguage || "";
    $scope.comparisonDose = storedData.ComparisonDose || "";
    $scope.supplementalConsentLanguage = userData.supplementalConsentText || "";

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

        plaintext += addPadding("", opt.col4, "-");
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
        plaintext += addPadding("", opt.col4, "-");
        plaintext += "\n";

        plaintext += addPadding("Research EDE (mSv)", opt.col3);
        plaintext += $scope.edeReportTotalWithoutSOC() + "\n";

        plaintext += addPadding("Standard of Care (mSv)", opt.col3);
        plaintext += $scope.edeReportTotalOnlySOC() + "\n";

        plaintext += addPadding("Total EDE (mSv)", opt.col3);
        plaintext += $scope.edeReportTotal() + "\n";

        plaintext += "\n";
        plaintext += addPadding("", opt.col4, "-");
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

    $scope.GenerateReportClicked = function() {
        validateUserData();
        updateSupplementalConsentText();
        $state.go("report-formatted", {storedData: storedData}, {location: true, inherit: false});
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
    
    function updateSupplementalConsentText() {
        UserDataService.updateSupplementalConsentText($scope.supplementalConsentLanguage);
    }

    function validateUserData() {
        console.log("validateUserData");
    }

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