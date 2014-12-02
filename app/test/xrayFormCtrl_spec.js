/*jshint expr: true*/
/*jshint -W008 */

describe ( "XRay Form Controller", function () {

    var xrayFormID = "XRay";
    var formName = "X-ray Examinations";
    var controller, scope, fakeGetDataService, edeCalculationService;

    var forms = [];
    var xrayController, xrayScope;
    var ctController, ctScope;

    beforeEach(module("RadCalc"));

    beforeEach(inject(function ($controller, $rootScope, getDataService, edeCalculationService) {
        fakeGetDataService = getDataService;
        fakeEdeCalculationService = edeCalculationService;
        // scope = $rootScope.$new();
        // controller = $controller('XRayFormCtrl', { $scope: scope });

        xrayScope = $rootScope.$new();
        xrayController = $controller("XRayFormCtrl", { $scope: xrayScope });

        ctScope = $rootScope.$new();
        ctController = $controller("CTFormCtrl", { $scope: ctScope });

        forms.push({"formID":"XRay", "formName":"X-ray Examinations", "scope":xrayScope});
        forms.push({"formID":"CT", "formName":"X-ray Computed Tomography Examinations", "scope":ctScope});

    }));

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
                    id = form.formID;
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
            var testProcedure = { study_num: 1, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                expect(scope.calculateEDE(testProcedure)).to.equal(0);
            }
        });

        it ( "undefined name returns zero", function () {
            var testProcedure = { study_num: 1, scans: 0, soc: false, gender: "mixed", ede: 0 };
            for (var formIndex in forms) {
                form = forms[formIndex];
                scope = form.scope;
                expect(scope.calculateEDE(testProcedure)).to.equal(0);
            }
        });

    });

    describe("Each controller calculates ede", function() {

        it ( "XRayFormCtrl ede calculation is correct", function () {
            fakeGetDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { study_num: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", ede: 0 };
            var expectedValue = 0.1234;
            fakeEdeCalculationService.roundEdeToDecimalPlaces = function() { return expectedValue; };

            var actual = xrayScope.calculateEDE(testProcedure);
            expect(actual).to.equal(expectedValue);
            expect(actual).to.equal(testProcedure.ede);
        });

        it ( "CTFormCtrl ede calculation is correct", function () {
            fakeGetDataService.getProcedurePropertyValue = function() { return 0; };

            var testProcedure = { study_num: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", ede: 0 };
            var expectedValue = 0.1234;
            fakeEdeCalculationService.roundEdeToDecimalPlaces = function() { return expectedValue; };

            var actual = ctScope.calculateEDE(testProcedure);
            expect(actual).to.equal(expectedValue);
            expect(actual).to.equal(testProcedure.ede);
        });

    });

});