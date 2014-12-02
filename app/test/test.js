/*jshint expr: true*/
/*jshint -W008 */

describe ( "XRay Form Controller", function () {

    var formID   = "XRay";
    var formName = "X-ray Examinations";
    var controller, scope;
    var testdata = {
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

    beforeEach(module('RadCalc'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new(); 
        controller = $controller('XRayFormCtrl', { $scope: scope });
    }));

    describe ( "form properties",
        function ()
        {
            it ( "has the correct id",
                function ( done ) {
                    expect(scope.form.id).to.equal(formID);
                    done();
                }
            );

            it ( "has the correct name",
                function ( done ) {
                    expect(scope.form.name).to.equal(formName);
                    done();
                }
            );

            it ( "has one procedure row",
                function ( done ) {
                    expect(scope.form.exams.length).to.equal(1);
                    done();
                }
            );
        }
    );

    describe ( "createRow", function ()
        {
            it ( "adds a row to procedures array",
                function ( done )
                {
                    var previousRows = scope.form.exams.length;
                    scope.createRow();
                    expect(scope.form.exams.length).to.equal(previousRows + 1);
                    done();
                }
            );
        }
    );

    describe ( "EDE", function ()
        {
            it ( "blank name returns zero",
                function ( done ) {
                    var testProcedure = { study_num: 1, exam: "", scans: 0, soc: false, gender: "mixed", ede: 0 };
                    expect(scope.EDE(testProcedure)).to.equal(0);
                    done();
                }
            );

            it ( "undefined name returns zero",
                function ( done ) {
                    var testProcedure = { study_num: 1, scans: 0, soc: false, gender: "mixed", ede: 0 };
                    expect(scope.EDE(testProcedure)).to.equal(0);
                    done();
                }
            );

            it ( "calculateEDE returns expected value",
                function ( done ) {
                    var singleEDE = 0.03;
                    var numScans  = 10;
                    expect(scope.calculateEDE(singleEDE, numScans)).to.equal(0.30);
                    done();
                }
            );

            it ( "roundEDE addresses a floating point rounding error",
                function ( done ) {
                    var singleEDE = 0.03;
                    var numScans  = 11;
                    var decimalPlaces = 2;
                    var edeWithFloatingPointRoundingError = singleEDE * numScans;
                    expect(scope.roundEDE(edeWithFloatingPointRoundingError, decimalPlaces)).to.equal("0.33");
                    done();
                }
            );

            it ( "returns expected ede value and sets procedure.ede property",
                function ( done ) {

                    var testProcedure = { study_num: 1, exam: "testProcedure", scans: 1, soc: false, gender: "mixed", ede: 0 };

                    scope.getProcedurePropertyValue = function() { return 0; };
                    scope.countDecimalPlaces = function() { return 0; };
                    scope.calculateEDE = function() { return 0; };
                    scope.roundEDE = function() {
                        return "0.1234";
                    };
                    var actual = scope.EDE(testProcedure);
                    expect(actual).to.equal(0.1234);
                    expect(actual).to.equal(testProcedure.ede);
                    done();
                }
            );
        }
    );

    describe ( "countDecimalPlaces", function () {
        it ( "returns zero when there is no decimal",
            function ( done ) {
                var numberToTest = 1;
                expect(scope.countDecimalPlaces(numberToTest)).to.equal(0);
                done();
            }
        );

        it ( "returns correct number when there is a decimal",
            function ( done ) {
                var numberToTest = 5.123;
                expect(scope.countDecimalPlaces(numberToTest)).to.equal(3);
                done();
            }
        );

        it ( "returns correct number when there is no leading zero",
            function ( done ) {
                var numberToTest = .49;
                expect(scope.countDecimalPlaces(numberToTest)).to.equal(2);
                done();
            }
        );
    });

    describe ( "getAllProcedures", function () {
        it ( "returns expected array of procedures",
            function ( done ) {
                scope.examData = testdata;
                var procedures, procedure, property;

                procedures = scope.getAllProcedures("NM");
                expect(procedures.length).to.equal(2);

                procedure = procedures[1];
                expect(procedure.name).to.equal("Abdominal CT with AND without constrast");
                expect(procedure.properties.length).to.equal(3);

                property = procedure.properties[1];
                expect(property.gender).to.equal("male");
                expect(property.value).to.equal(7.8);

                done();
            }
        );
    });

});