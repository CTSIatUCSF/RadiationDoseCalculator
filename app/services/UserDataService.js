angular.module("RadCalc.services").factory("UserDataService", function($q, $http) {

    // Private
    var userData = {};
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
});