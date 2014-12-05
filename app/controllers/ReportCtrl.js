angular.module("RadCalc.controllers").controller("ReportCtrl", function($scope, $state, UserDataService, StoredDataService) {

    var storedData = StoredDataService.storedData();
    var userData = UserDataService.userData();

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