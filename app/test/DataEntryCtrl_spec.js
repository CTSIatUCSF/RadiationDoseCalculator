/*jshint expr: true*/
/*jshint -W008 */

describe ( "Form Controllers", function () {

    var xrayFormID = "XRay";
    var formName = "X-ray Examinations";
    var controller, scope, testdata, defaultExamRows, fakeUserDataService, fakeStoredDataService;


    beforeEach(module("RadCalc"));

    beforeEach(inject(function ($controller, $rootScope, UserDataService, StoredDataService, ConfigDataService) {
        fakeUserDataService = UserDataService;
        fakeStoredDataService = StoredDataService;
        fakeConfigDataService = ConfigDataService;

        scope = $rootScope.$new();
        controller = $controller("DataEntryCtrl", { $scope: scope });

        // forms.push({"id":"XRay", "formName":"X-ray Examinations", "scope":xrayScope, "exams": [{"ede": 100}]});
        // forms.push({"id":"CT", "formName":"X-ray Computed Tomography Examinations", "scope":ctScope, "exams": [{"ede": 100}]});
        // forms.push({"id":"NM", "formName":"Nuclear Medicine Examinations", "scope":nmScope, "exams": [{"ede": 100}]});
        // forms.push({"id":"Flouro", "formName":"Flouroscopy Examinations", "scope":floScope, "exams": [{"ede": 100}]});

        // var formIndex, form;
        // for (formIndex in forms) {
        //     form = forms[formIndex];
        //     fakeUserDataService.updateFormData(form);
        // }

    }));

    // defaultExamRows = {
    //     fakeConfigDataService
    //     "CT":     { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 },
    //     "NM":     { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", injectedDose: 0, ede: 0 },
    //     "XRay":   { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 },
    //     "Flouro": { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", minutes: 0, ede: 0 }
    // };

    testdata = {
        "ConsentNarrative":"This is a sample consent narrative.",
        "ComparisonDoseSupportingLanguage":"This is a sample of comparison dose supporting langauge.",
        "ComparisonDose":100,
        "DoseData":[{
                "name":"CT",
                "exams":[
                    { "name":"Abdominal CT slngle slice", "properties":[
                            { "gender":"female", "value":0.24 },
                            { "gender":"male", "value":0.24 },
                            { "gender":"mixed", "value":0.24 } ]},
                    { "name":"Abdominal CT with AND without constrast", "properties":[
                            { "gender":"female", "value":7.8 },
                            { "gender":"male", "value":7.8 },
                            { "gender":"mixed", "value":7.8 } ]}
                ]}, {
                "name":"NM",
                "exams":[
                    { "name":"Abdominal CT slngle slice", "properties":[
                            { "gender":"female", "value":0.24 },
                            { "gender":"male", "value":0.24 },
                            { "gender":"mixed", "value":0.24 } ]},
                    { "name":"Abdominal CT with AND without constrast", "properties":[
                            { "gender":"female", "value":7.8 },
                            { "gender":"male", "value":7.8 },
                            { "gender":"mixed", "value":7.8 } ]}
                ]}
        ]
    };

    // describe ( "form properties",
    //     function () {

    //         var scope, form;

    //         it ( "has the correct id", function () {
    //             var id;
    //             for (var formIndex in forms) {
    //                 form = forms[formIndex];
    //                 scope = form.scope;
    //                 id = form.id;
    //                 expect(scope.form.id).to.equal(id);
    //             }
    //         });

    //         it ( "has the correct name", function () {
    //             var name;
    //             for (var formIndex in forms) {
    //                 form = forms[formIndex];
    //                 scope = form.scope;
    //                 name = form.formName;
    //                 expect(scope.form.name).to.equal(name);
    //             }
    //         });

    //         it ( "has one procedure row", function () {
    //             for (var formIndex in forms) {
    //                 form = forms[formIndex];
    //                 scope = form.scope;
    //                 expect(scope.form.exams.length).to.equal(1);
    //             }
    //         });

    //     }
    // );

    describe ( "createRow", function () {
        it ( "adds a row to procedures array", function () {
            scope.allProcedures = [];
            scope.newProcedure("CT");
            expect(1).to.equal(scope.allProcedures.length);
        });
    });

    describe ( "EDE", function() {

        it ( "blank name returns NaN", function () {
            var testProcedure = { "id": 1, "categoryid": "CT", "exam": "", "scans": 0, "soc": false, "gender": "mixed", "ede": 0 };
            expect(isNaN(scope.getProcedureEdeCalculation(testProcedure))).to.be.true;
        });

        it ( "undefined name returns NaN", function () {
            var testProcedure = { "id": 1, "categoryid": "NM", "scans": 0, "soc": false, "gender": "mixed", "ede": 0 };
            expect(isNaN(scope.getProcedureEdeCalculation(testProcedure))).to.be.true;
        });

    });

    describe("EDE totals", function() {

        beforeEach(function() {
            var procedures = [
                { "categoryid":"XRay", "ede":1.05, "soc":false },
                { "categoryid":"XRay", "ede":2, "soc":true },
                { "categoryid":"XRay", "ede":3.005, "soc":false },
                { "categoryid":"XRay", "ede":4, "soc":true },
                { "categoryid":"XRay", "ede":5.0005, "soc":false },
                { "categoryid":"XRay", "ede":6, "soc":true }
            ];

            scope.allProcedures = procedures;
            fakeUserDataService.updateProcedures(procedures);
        });
        

        it("with SOC", function() {
            expect(fakeUserDataService.edeTotal("XRay")).to.equal(21.06);
        });

        it("without SOC", function() {
            expect(fakeUserDataService.edeTotalWithoutSOC("XRay")).to.equal(9.06);
        });

    });

    describe ( "adding new procedures", function () {

        it ( "added sucessfully", function () {
            scope.allProcedures = [];
            scope.newProcedure("Flouro");
            scope.newProcedure("CT");

            expect(2).to.equal(scope.allProcedures.length);
        });

    });

    describe ( "removing procedures", function () {

        it ( "removed sucessfully", function () {
            scope.allProcedures = [];
            scope.newProcedure("NM");
            scope.newProcedure("NM");
            scope.newProcedure("NM");
            scope.removeProcedure("NM", 1);

            expect(2).to.equal(scope.allProcedures.length);
        });

    });

    describe("Controller gets calculated ede", function() {

        it ( "DataEntryCtrl calls UserDataService.getProcedureEdeCalculation", function () {
            fakeStoredDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { "id": 1, "categoryid": "CT", "exam": "testProcedure", "scans": 1, "soc": false, "gender": "mixed", "ede": 0 };
            var expectedValue = 0.1234;
            fakeUserDataService.getProcedureEdeCalculation = function() { return expectedValue; };

            var actual = scope.getProcedureEdeCalculation(testProcedure);
            expect(expectedValue).to.equal(actual);
            expect(testProcedure.ede).to.equal(actual);
        });

    });

});