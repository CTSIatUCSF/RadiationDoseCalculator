/*jshint expr: true*/
/*jshint -W008 */

describe ( "Form Controllers", function () {

    var xrayFormID = "XRay";
    var formName = "X-ray Examinations";
    var controller, scope, testdata, defaultExamRows, fakeUserDataService, fakeStoredDataService;

    var forms = [];
    var xrayController, xrayScope;
    var ctController, ctScope;
    var nmController, nmScope;
    var floController, floScope;

    beforeEach(module("RadCalc"));

    beforeEach(inject(function ($controller, $rootScope, UserDataService, StoredDataService) {
        fakeUserDataService = UserDataService;
        fakeStoredDataService = StoredDataService;

        xrayScope = $rootScope.$new();
        xrayController = $controller("XRayFormCtrl", { $scope: xrayScope });

        ctScope = $rootScope.$new();
        ctController = $controller("CTFormCtrl", { $scope: ctScope });

        nmScope = $rootScope.$new();
        nmController = $controller("NMFormCtrl", { $scope: nmScope });

        floScope = $rootScope.$new();
        floController = $controller("FlouroscopyFormCtrl", { $scope: floScope });

        forms.push({"id":"XRay", "formName":"X-ray Examinations", "scope":xrayScope, "exams": [{"ede": 100}]});
        forms.push({"id":"CT", "formName":"X-ray Computed Tomography Examinations", "scope":ctScope, "exams": [{"ede": 100}]});
        forms.push({"id":"NM", "formName":"Nuclear Medicine Examinations", "scope":nmScope, "exams": [{"ede": 100}]});
        forms.push({"id":"Flouro", "formName":"Flouroscopy Examinations", "scope":floScope, "exams": [{"ede": 100}]});

        var formIndex, form;
        for (formIndex in forms) {
            form = forms[formIndex];
            fakeUserDataService.updateFormData(form);
        }

    }));

    defaultExamRows = {
        "CT":     { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 },
        "NM":     { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", injectedDose: 0, ede: 0 },
        "XRay":   { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 },
        "Flouro": { id: 0, exam: "", scans: 0, soc: false, gender: "mixed", minutes: 0, ede: 0 }
    };

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

    describe ( "form properties",
        function () {

            var scope, form;

            it ( "has the correct id", function () {
                var id;
                for (var formIndex in forms) {
                    form = forms[formIndex];
                    scope = form.scope;
                    id = form.id;
                    expect(scope.form.id).to.equal(id);
                }
            });

            it ( "has the correct name", function () {
                var name;
                for (var formIndex in forms) {
                    form = forms[formIndex];
                    scope = form.scope;
                    name = form.formName;
                    expect(scope.form.name).to.equal(name);
                }
            });

            it ( "has one procedure row", function () {
                for (var formIndex in forms) {
                    form = forms[formIndex];
                    scope = form.scope;
                    expect(scope.form.exams.length).to.equal(1);
                }
            });

        }
    );

    describe ( "createRow", function () {
        it ( "adds a row to procedures array", function () {
            var previousRows;
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                previousRows = scope.form.exams.length;
                scope.createRow();
                expect(scope.form.exams.length).to.equal(previousRows + 1);
            }
        });
    });

    describe ( "EDE", function() {

        var scope, form;

        it ( "blank name returns zero", function () {
            var testProcedure = { id: 1, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                expect(scope.calculateEDE(testProcedure)).to.equal(0);
            }
        });

        it ( "undefined name returns zero", function () {
            var testProcedure = { id: 1, scans: 0, soc: false, gender: "mixed", ede: 0 };
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                expect(scope.calculateEDE(testProcedure)).to.equal(0);
            }
        });

    });

    describe("EDE totals", function() {

        beforeEach(function() {
            var procedures = [
                { ede:1.01, soc:false },
                { ede:2, soc:true },
                { ede:3.001, soc:false },
                { ede:4, soc:true },
                { ede:5.0001, soc:false },
                { ede:6, soc:true }
            ];

            var formIndex, form;
            for (formIndex in forms) {
                form = forms[formIndex];
                form.exams = procedures;
                fakeUserDataService.updateFormData(form);
            }
        });
        

        it("with SOC", function() {
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                expect(fakeUserDataService.edeTotal(scope.form.id)).to.equal(21.0111);
            }
        });

        it("without SOC", function() {
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                expect(fakeUserDataService.edeTotalWithoutSOC(scope.form.id)).to.equal(9.0111);
            }
        });

    });

    describe ( "removing procedures", function () {

        it ( "removes sucessfully", function () {
            var formIndex, testexam;
            for (formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;

                testexam0 = defaultExamRows[form.id];
                testexam1 = defaultExamRows[form.id];
                testexam2 = defaultExamRows[form.id];

                testexam0.id = 0;
                testexam1.id = 1;
                testexam2.id = 2;

                scope.form.exams = [];
                scope.form.exams.push(testexam0);
                scope.form.exams.push(testexam1);
                scope.form.exams.push(testexam2);
                scope.removeProcedure(testexam1.id);

                expect(2).to.equal(scope.form.exams.length);
            }
        });

    });

    describe("Each controller calculates ede", function() {

        it ( "XRayFormCtrl ede calculation is correct", function () {
            fakeStoredDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { id: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", ede: 0 };
            var expectedValue = 0.1234;
            fakeUserDataService.simpleEdeCalculation = function() { return expectedValue; };
            fakeUserDataService.countDecimalPlaces = function() { return 4; };

            var actual = xrayScope.calculateEDE(testProcedure);
            expect(actual).to.equal(expectedValue);
            expect(actual).to.equal(testProcedure.ede);
        });

        it ( "CTFormCtrl ede calculation is correct", function () {
            fakeStoredDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { id: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", ede: 0 };
            var expectedValue = 0.1234;
            fakeUserDataService.simpleEdeCalculation = function() { return expectedValue; };
            fakeUserDataService.countDecimalPlaces = function() { return 4; };

            var actual = ctScope.calculateEDE(testProcedure);
            expect(actual).to.equal(expectedValue);
            expect(actual).to.equal(testProcedure.ede);
        });

        it ( "NMFormCtrl ede calculation is correct", function () {
            fakeStoredDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { id: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", injectedDose:2.0, ede: 0 };
            var ede = 0.1234;
            fakeUserDataService.simpleEdeCalculation = function() { return ede; };
            fakeUserDataService.countDecimalPlaces = function() { return 4; };
            var expectedValue = ede * testProcedure.injectedDose;

            var actual = nmScope.calculateEDE(testProcedure);
            expect(actual).to.equal(expectedValue);
            expect(actual).to.equal(testProcedure.ede);
        });

        it ( "FlouroscopyFormCtrl ede calculation is correct", function () {
            fakeStoredDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { id: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", minutes:2.0, ede: 0 };
            var ede = 0.1234;
            fakeUserDataService.simpleEdeCalculation = function() { return ede; };
            fakeUserDataService.countDecimalPlaces = function() { return 4; };
            var expectedValue = ede * testProcedure.minutes;

            var actual = floScope.calculateEDE(testProcedure);
            expect(actual).to.equal(expectedValue);
            expect(actual).to.equal(testProcedure.ede);
        });

    });

});