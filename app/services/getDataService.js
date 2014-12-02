angular.module("RadCalc.services").factory("getDataService", function($q, $http) {

  var data = {};
  var getData;

  getData = function() {
    var deferred = $q.defer(),
        httpPromise = $http.get("/js/data.json");

    httpPromise.then(function (response) {
      deferred.resolve(response);
    }, function (error) {
      console.error(error);
    });

    return deferred.promise;
  };

  getData().then(function (response) {
      data = response.data;
  }, function (error) {
      console.error(error);
  });

  return {

    data: getData,

    getAllProcedures: function(categoryID) {
        for (var categoryIndex in data.DoseData) {
            var category = data.DoseData[categoryIndex];
            if (category.name == categoryID) {
                return category.exams;
            }
        }
    },

    getProcedure: function(categoryID, procedureName) {
        var allProcedures = this.getAllProcedures(categoryID);
        for (var procedureIndex in allProcedures) {
            var procedure = allProcedures[procedureIndex];
            if (procedure.name == procedureName) {
                return procedure;
            }
        }
    },

    getAllProcedureProperties: function(categoryID, procedureName) {
        var procedure = this.getProcedure(categoryID, procedureName);
        return procedure.properties;
    },

    getProcedurePropertyValue: function(categoryID, procedureName, genderPredominance) {
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