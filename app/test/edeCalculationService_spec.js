/*jshint expr: true*/
/*jshint -W008 */

describe ( "EDE Calculation Service", function () {
    
    var edeCalculationService;
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

    beforeEach(inject(function (_edeCalculationService_) {
        edeCalculationService = _edeCalculationService_;
    }));

    it ( "simpleEdeCalculation returns expected value", function() {
        var singleEDE = 0.03;
        var numScans  = 10;
        var expectedValue = 0.3;
        expect(edeCalculationService.simpleEdeCalculation(singleEDE, numScans)).to.equal(expectedValue);
    });

    it ( "roundEdeToDecimalPlaces addresses a floating point rounding error", function() {
        var singleEDE = 0.03;
        var numScans  = 11;
        var decimalPlaces = 2;
        var edeWithFloatingPointRoundingError = singleEDE * numScans;
        var expected = ("0.33");
        var actual = edeCalculationService.roundEdeToDecimalPlaces(edeWithFloatingPointRoundingError, decimalPlaces);
        expect(actual).to.equal(expected);
    });

    describe ( "countDecimalPlaces",
    function ()
    {
        it ( "returns zero when there is no decimal",
            function ( done ) {
                var numberToTest = 1;
                var expected = 0;
                expect(edeCalculationService.countDecimalPlaces(numberToTest)).to.equal(expected);
                done();
            }
        );

        it ( "returns correct number when there is a decimal",
            function ( done ) {
                var numberToTest = 5.123;
                var expected = 3;
                expect(edeCalculationService.countDecimalPlaces(numberToTest)).to.equal(expected);
                done();
            }
        );

        it ( "returns correct number when there is no leading zero",
            function ( done ) {
                var numberToTest = .49;
                var expected = 2;
                expect(edeCalculationService.countDecimalPlaces(numberToTest)).to.equal(expected);
                done();
            }
        );
    }
);

});

            
