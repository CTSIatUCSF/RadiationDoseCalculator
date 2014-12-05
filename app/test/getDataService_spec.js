/*jshint expr: true*/
/*jshint -W008 */

describe ( "Get Data Service", function () {

        var UserDataService;

        beforeEach(module('RadCalc'));

        beforeEach(inject(function (_UserDataService_) {
            UserDataService = _UserDataService_;
        }));

        it ( "simpleEdeCalculation returns expected value", function() {
            var singleEDE = 0.03;
            var numScans  = 10;
            var expectedValue = 0.3;
            expect(UserDataService.simpleEdeCalculation(singleEDE, numScans)).to.equal(expectedValue);
        });

        describe ( "countDecimalPlaces",
        function ()
        {
            it ( "returns zero when there is no decimal",
                function () {
                    var numberToTest = 1;
                    var expected = 0;
                    expect(UserDataService.countDecimalPlaces(numberToTest)).to.equal(expected);
                }
            );

            it ( "returns correct number when there is a decimal",
                function () {
                    var numberToTest = 5.123;
                    var expected = 3;
                    expect(UserDataService.countDecimalPlaces(numberToTest)).to.equal(expected);
                }
            );

            it ( "returns correct number when there is no leading zero",
                function () {
                    var numberToTest = .49;
                    var expected = 2;
                    expect(UserDataService.countDecimalPlaces(numberToTest)).to.equal(expected);
                }
            );
        });

        describe ( "getScanCount", function () {
            it ( "returns zero when given an invalid formId", function () {
                var formId = "badFormId";
                var expected = 0;
                expect(UserDataService.getScanCount(formId)).to.equal(expected);
            });

            it ( "returns correct value for given formId", function () {
                var forms = [];
                forms.push({"expected": 3, "data": {"id":"XRay", "exams": [{"exam": "a", "scans": 1}, {"exam": "b", "scans": 2}]}});
                forms.push({"expected": 5, "data": {"id":"CT", "exams": [{"exam": "a", "scans": 2}, {"exam": "b", "scans": 3}]}});
                forms.push({"expected": 7, "data": {"id":"NM", "exams": [{"exam": "a", "scans": 3}, {"exam": "b", "scans": 4}]}});
                forms.push({"expected": 9, "data": {"id":"Flouro", "exams": [{"exam": "a", "scans": 4}, {"exam": "b", "scans": 5}]}});

                var formIndex, form, data;
                for (formIndex in forms) {
                    form = forms[formIndex];
                    data = form.data;
                    UserDataService.updateFormData(data);
                    expect(UserDataService.getScanCount(data.id)).to.equal(form.expected);
                }
            });
        });
        
    }
    
);