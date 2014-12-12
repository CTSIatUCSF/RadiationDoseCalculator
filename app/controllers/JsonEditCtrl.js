angular.module("RadCalc.controllers").controller("JsonEditCtrl", function($scope, $state, StoredDataService, ConfigDataService) {

    var createNewProcedure, getCategory, getProcedureIndex;

    createNewProcedure = function() {
        return  {
            "name":"new procedure ",
            "citation": "sample citation",
            "properties":[
                {
                    "name":"EDE (female)",
                    "gender":"female",
                    "value":0
                },
                {
                    "name":"EDE (male)",
                    "gender":"male",
                    "value":0
                },
                {
                    "name":"EDE (mixed)",
                    "gender":"mixed",
                    "value":0
                }
            ]
        };
    };

    $scope.storedData = StoredDataService.storedData();

    $scope.saveJson = function() {
        console.log("saving...");
        saveAs(
            new Blob(
                [JSON.stringify($scope.storedData, null, 4)], { type: "application/json" }
            ), "data.json"
        );
    };

    $scope.getCategoryName = function(categoryId) {
        return ConfigDataService.getNameForId(categoryId);
    };

    $scope.removeProcedure = function(categoryId, procedureName) {
        var category;
        procedureIndex = getProcedureIndex(categoryId, procedureName);
        category = getCategory(categoryId);
        category.exams.splice(procedureIndex, 1);
    };

    $scope.addProcedure = function(categoryId) {
        var category, newProc;
        category = getCategory(categoryId);
        newProcedure = createNewProcedure();
        newProcedure.name += (category.exams.length + 1);
        category.exams.splice(0, 0, newProcedure);
    };

    getCategory = function(categoryId) {
            console.log(categoryId);

        var doseData = $scope.storedData.DoseData;
        var categoryIndex, category;
        for (categoryIndex in doseData) {
            console.log(categoryIndex);
            category = doseData[categoryIndex];
            if (category.name === categoryId) {
                return category;
            }
        }
    };

    getProcedureIndex = function(categoryId, procedureName) {
        var category = getCategory(categoryId);
        var procedureIndex, procedure;
        for (procedureIndex in category.exams) {
            procedure = category.exams[procedureIndex];
            if (procedure.name === procedureName) {
                return procedureIndex;
            }
        }
    };

});