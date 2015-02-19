angular.module("RadCalc.services").factory("StoredDataService", function($q, $http) {

    var storedData = {};
    var promise;
    var hideFluoro = true;

    promise = $http.get("js/data/RadiationDataTables.json").success(function (response) {
      storedData = response;
      if (hideFluoro) {
        //remove Flouro section from storedData
        var name = "Fluoro";
        var data = storedData.DoseData;
        // iterate through the list, find the matching name, splice, and then break to exit the loop
        for(var i = 0; i < data.length; i++) {
            if(data[i].name === name) {
                data = data.splice(i, 1);
                break;
            }
        }
      }
    });

    return {

        promise:promise,
        hideFluoro:hideFluoro,

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

        helpEmailAddress: function() {
            return storedData.HelpEmailAddress;
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
});