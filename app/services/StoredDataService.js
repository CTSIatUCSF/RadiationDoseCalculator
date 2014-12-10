angular.module("RadCalc.services").factory("StoredDataService", function($q, $http) {

    var storedData = {};
    var promise;

    promise = $http.get("/js/data.json").success(function (response) {
      storedData = response;
    });

    return {

        promise:promise,

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

        getAllProcedures: function(categoryID) {
            for (var categoryIndex in storedData.DoseData) {
                var category = storedData.DoseData[categoryIndex];
                if (category.name == categoryID) {
                    return category.exams;
                }
            }
        },

        getProcedure: function(categoryID, procedureName) {
            if (procedureName === null) { return; }
            var allProcedures = this.getAllProcedures(categoryID);
            for (var procedureIndex in allProcedures) {
                var procedure = allProcedures[procedureIndex];
                if (procedure.name == procedureName) {
                    return procedure;
                }
            }
        },

        getAllProcedureProperties: function(categoryID, procedureName) {
            if (procedureName === null) { return; }
            var procedure = this.getProcedure(categoryID, procedureName);
            return procedure.properties;
        },

        getProcedurePropertyValue: function(categoryID, procedureName, genderPredominance) {
            if (procedureName === null) { return; }
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