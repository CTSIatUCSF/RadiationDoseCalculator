angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, getDataService, StoredDataService) {

    var storedData = StoredDataService.storedData();
    var userData = getDataService.userData();

    $scope.consentNarrative = storedData.ConsentNarrative;
    $scope.comparisonDoseSupportingLanguage = storedData.ComparisonDoseSupportingLanguage;
    $scope.comparisonDose = storedData.ComparisonDose;
    $scope.supplementalConsentLanguage = userData.supplementalConsentText;

    $scope.GenerateReportClicked = function() {
        validateUserData();
        updateSupplementalConsentText();
        $state.go("report", {storedData: storedData}, {location: true, inherit: false});
    };

    $scope.DataEntryClicked = function() {
        $state.go("dataEntry", {storedData: storedData}, {location: true, inherit: false});
    };

    function updateSupplementalConsentText() {
        getDataService.updateSupplementalConsentText($scope.supplementalConsentLanguage);
    }

    function validateUserData() {
        console.log("validateUserData");
    }

    $scope.getScanCount = function(formId) {
        return getDataService.getScanCount(formId);
    };

    $scope.edeTotal = function(formId) {
        return getDataService.edeTotal(formId);
    };

    $scope.edeTotalWithoutSOC = function(formId) {
        return getDataService.edeTotalWithoutSOC(formId);
    };

    $scope.edeTotalOnlySOC = function(formId) {
        return getDataService.edeTotalOnlySOC(formId);
    };

    $scope.edeReportTotal = function() {
        return getDataService.edeReportTotal();
    };

    $scope.edeReportTotalOnlySOC = function() {
        return getDataService.edeReportTotalOnlySOC();
    };

    $scope.edeReportTotalWithoutSOC = function() {
        return getDataService.edeReportTotalWithoutSOC();
    };

});