angular.module("RadCalc.controllers").controller("JsonEditCtrl", function($scope, $state, $templateCache, StoredDataService, ConfigDataService) {

    var createNewProcedure, addFormTemplate, tooltipHtmlConsentNarrative, getCategory, getProcedureIndex;

    createNewProcedure = function() {
        return  {
            "name":"new procedure ",
            "citation": "sample citation",
            "properties":[
                {
                    "name":"ED (female)",
                    "gender":"female",
                    "value":0
                },
                {
                    "name":"ED (male)",
                    "gender":"male",
                    "value":0
                },
                {
                    "name":"ED (mixed)",
                    "gender":"mixed",
                    "value":0
                }
            ]
        };
    };

    addFormTemplate = function(categoryId) {
        var html = "";
        var genderLabelFemale = "ED (female):";
        var genderLabelMale   = "ED (male):";
        var genderLabelMixed  = "ED (mixed):";
        var categoryTitle = ConfigDataService.getTitleForId(categoryId);

        if (categoryId.toUpperCase() === "NM") {
            genderLabelFemale = "ED/mCi (female):";
            genderLabelMale   = "ED/mCi (male):";
            genderLabelMixed  = "ED/mCi (mixed):";
        }

        html += "<ng-form name='addProcedure' isolate-form>";
        html += "    <table class='table'>";
        html += "        <tr>";
        html += "            <td class='label-name'>Name:</td>";
        html += "            <td class='value-name'><input name='name' class='form-control name' type='text' ng-model='addFormData.name' /></td>";
        html += "        </tr>";
        html += "        <tr>";
        html += "            <td class='label-citation'>Citation:</td>";
        html += "            <td class='value-citation'><textarea class='form-control citation' type='text' ng-model='addFormData.citation'></textarea></td>";
        html += "        </tr>";
        html += "        <tr>";
        html += "            <td class='label-property'>" + genderLabelFemale + "</td>";
        html += "            <td class='value-property'><input class='form-control property' type='number' ng-model='addFormData.female' numbers-only /></td>";
        html += "        </tr>";
        html += "        <tr>";
        html += "            <td class='label-property'>" + genderLabelMale + "</td>";
        html += "            <td class='value-property'><input class='form-control property' type='number' ng-model='addFormData.male' numbers-only /></td>";
        html += "        </tr>";
        html += "        <tr>";
        html += "            <td class='label-property'>" + genderLabelMixed + "</td>";
        html += "            <td class='value-property'><input class='form-control property' type='number' ng-model='addFormData.mixed' numbers-only /></td>";
        html += "        </tr>";
        html += "    </table>";
        html += "    <div class='right'>";
        html += "        <button class='btn standard-btn' ng-click='addProcedureCancelClicked()'>Cancel</button>";
        html += "        <button class='btn standard-btn green' ng-disabled='!enableAddProcedureButton' ng-click='addProcedureAddClicked(); jsonData.$setDirty()'>Add</button>";
        html += "    </div>";
        html += "</ng-form>";

        return html;
    };

    tooltipHtmlConsentNarrative = function() {
        var html = "";

        html += "<p>When editing the consent narrative, there are tags wrapped in &lt;&lt&gt;&gt that get replaced with various settings or calculated values when they are displayed to the end user:</p>";
        html += "<table class=''>";
        html += "    <tr>";
        html += "        <th class='tooltip-label'>Tag:</th>";
        html += "        <th class='tooltip-value'>Description:</th>";
        html += "    </tr>";
        html += "    <tr>";
        html += "        <td class='tooltip-label'>&lt;&lt;effectiveDose&gt;&gt;</td>";
        html += "        <td class='tooltip-value'>Calculated value based on data entered by the user. See Effective Dose Type below for more details.</td>";
        html += "    </tr>";
        html += "    <tr>";
        html += "        <td class='tooltip-label'>&lt;&lt;comparisonDoseUnit&gt;&gt;</td>";
        html += "        <td class='tooltip-value'>See Comparison Dose Unit below.</td>";
        html += "    </tr>";
        html += "    <tr>";
        html += "        <td class='tooltip-label'>&lt;&lt;comparisonDoseQuotient&gt;&gt;</td>";
        html += "        <td class='tooltip-value'>Calculated value (effective dose / comparison dose). Indicates the number of comparison doses.</td>";
        html += "    </tr>";
        html += "    <tr>";
        html += "        <td class='tooltip-label'>&lt;&lt;comparisonDose&gt;&gt;</td>";
        html += "        <td class='tooltip-value'>See Comparison Dose below.</td>";
        html += "    </tr>";
        html += "</table>";

        return html;
    };

    storeAddFormTemplates = function() {
        $templateCache.put("CT", addFormTemplate("CT"));
        $templateCache.put("NM", addFormTemplate("NM"));
        $templateCache.put("XRay", addFormTemplate("XRay"));
        $templateCache.put("Fluoro", addFormTemplate("Fluoro"));
    };

    initAddFormData = function() {
        return {
            "categoryid": "CT",
            "name":       "",
            "citation":   "",
            "female":     0,
            "male":       0,
            "mixed":      0
        };
    };

    sortProceduresList = function(proceduresList) {
        proceduresList.sort(function(a, b) {
            return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);
        });
    };

    addNewProcedure = function(procedureData) {
        var index, property;
        var category = getCategory(procedureData.categoryid);
        var procedure = createNewProcedure();
        procedure.name = procedureData.name;
        procedure.citation = procedureData.citation;
        for (index in procedure.properties) {
            property = procedure.properties[index];
            property.value = procedureData[property.gender];
        }
        category.exams.push(procedure);
        return category.exams;
    };

    getCategory = function(categoryId) {
        var doseData = $scope.storedData.DoseData;
        var categoryIndex, category;
        for (categoryIndex in doseData) {
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

    storeAddFormTemplates();
    $scope.storedData = StoredDataService.storedData();
    $scope.showAddForm = false;
    $scope.addFormData = initAddFormData();
    $scope.enableSaveButton = false;
    $scope.enableAddProcedureButton = false;
    $scope.tooltipConsentNarrative = tooltipHtmlConsentNarrative();


// <<effectiveDose>>   Calculated value based on data entered by the user. See Effective Dose Type below for more details.
// <<comparisonDoseUnit>>  See Comparison Dose Unit below.
// <<comparisonDoseQuotient>>  Calculated value (effective dose / comparison dose). Indicates the number of comparison doses.
// <<comparisonDose>>  See Comparison Dose below.

    $scope.tooltipComparisonDose = "Numeric value. Indicates the comparison dose to display in the &lt;&lt;comparisonDose&gt;&gt tag in the consent narrative.";
    $scope.tooltipComparisonDoseUnit = "<p>Indicates which unit (<b>rem</b> or <b>mSv</b>) to use for the &lt;&lt;effectiveDose&gt;&gt; and &lt;&lt;comparisonDose&gt;&gt; in the consent narrative.</p><b>Note:</b> Reports produced by the application always show their data in mSv. This value only applies to the consent narrative.";
    $scope.tooltipEffectiveDoseType = "<p>Determines how the effective dose is calculated.</p><p>Selecting <b>Total</b> will show the total of all exams entered into the calculator, regardless of whether they are marked as \"standard of care.\"</p>Selecting <b>Research</b> will exclude exams marked as \"standard of care\" from the calculation.";
    $scope.$watch("addFormData", function() { $scope.enableAddProcedureButton = ($scope.addFormData.name !== ""); }, true);
    $scope.$watch("storedData", function() { $scope.enableSaveButton = true; }, true);

    $scope.addProcedureCancelClicked = function() {
        $scope.addFormData = initAddFormData();
        $scope.showAddForm = false;
    };

    $scope.addProcedureAddClicked = function() {
        if ($scope.addFormData.name !== "") {
            var proceduresList = addNewProcedure($scope.addFormData);
            sortProceduresList(proceduresList);
            $scope.addFormData = initAddFormData();
            $scope.showAddForm = false;
        }
    };

    $scope.saveJson = function() {
        saveAs(
            new Blob(
                [JSON.stringify($scope.storedData, null, 4)], { type: "application/json" }
            ), "RadiationDataTables.json"
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

});