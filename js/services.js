angular.module("RadCalc.services", []).factory("getDataService", function($q, $http) {
  return {
    getData: function() {
      var deferred = $q.defer(),
          httpPromise = $http.get("/js/data.json");

      httpPromise.then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        console.error(error);
      });

      return deferred.promise;
    },

    reformatJsonData: function(jsonData) {
        var reformattedData = this.reformattedDataDefaults(jsonData);
        var keysDoseData = Object.keys(jsonData.DoseData);
        var examKey, examCategoryKey, exam, examCategoryIndex, examCategory;
        var reformattedExamCategory;
        for (examCategoryIndex in keysDoseData) {
            examCategoryKey = keysDoseData[examCategoryIndex];
            examCategory = jsonData.DoseData[examCategoryKey];
            reformattedExamCategory = {"name":examCategoryKey, "exams": []};
            for (examKey in examCategory) {
              exam = {"name": examKey, "properties": []};
              var examProperties = examCategory[examKey];
              for (var propertyIndex in examProperties) {
                  var propertyName = propertyIndex;
                  var propertyGender = this.getGender(propertyName);
                  var propertyValue = examProperties[propertyIndex];
                  var property = {"name" :propertyName, "gender": propertyGender,"value": propertyValue};
                  exam.properties.push(property);
              }

              reformattedExamCategory.exams.push(exam);
            }
            reformattedData.DoseData.push(reformattedExamCategory);
        }
        return reformattedData;
    },
  
    reformattedDataDefaults: function(jsonData) {
        var reformattedData = {};
        reformattedData.ConsentNarrative = jsonData.ConsentNarrative;
        reformattedData.ComparisonDoseSupportingLanguage = jsonData.ComparisonDoseSupportingLanguage;
        reformattedData.ComparisonDose = jsonData.ComparisonDose;
        reformattedData.DoseData = [];
        return reformattedData;
    },

    getGender: function(propertyName) {
      if (propertyName.indexOf("female") != -1) {
        return "female";
      }  else if (propertyName.indexOf("mixed") != -1) {
        return "mixed";
      } else {
        return "male";
      }
    }
  };
});