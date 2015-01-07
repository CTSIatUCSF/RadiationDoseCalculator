angular.module("RadCalc.controllers").controller("DataEntryCtrl", function($scope, $state, UserDataService, StoredDataService, ConfigDataService) {

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
    $scope.helpEmailAddress = StoredDataService.helpEmailAddress() || "";
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

});