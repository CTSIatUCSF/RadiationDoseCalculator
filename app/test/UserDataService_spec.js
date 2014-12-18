/*jshint expr: true*/
/*jshint -W008 */

describe ( "UserDataService", function () {

        var UserDataService;

        beforeEach(module('RadCalc'));

        beforeEach(inject(function (_UserDataService_) {
            UserDataService = _UserDataService_;
        }));

        describe("getProcedureEdeCalculation", function() {
            it ( "returns expected value for CT procedures", function() {
                var testProcedure  = { "id": 1, "categoryid": "CT", "scans": 3, "soc": false, "gender": "mixed", "ede": 0 };
                var baseEDE = 0.03;
                var expectedValue = 0.09;
                expect(UserDataService.getProcedureEdeCalculation(testProcedure, baseEDE)).to.equal(expectedValue);
            });
            it ( "returns expected value for XRay procedures", function() {
                var testProcedure = { "id": 1, "categoryid": "XRay",   "scans": 9, "soc": false, "gender": "mixed", "ede": 0 };
                var baseEDE = 0.033;
                var expectedValue = 0.30;
                expect(UserDataService.getProcedureEdeCalculation(testProcedure, baseEDE)).to.equal(expectedValue);
            });
            it ( "returns expected value for NM procedures", function() {
                var testProcedure = { "id": 1, "categoryid": "NM", "scans": 11, "soc": false, "gender": "mixed", "injectedDose": 2, "ede": 0 };
                var baseEDE = 0.03;
                var expectedValue = 0.66;
                expect(UserDataService.getProcedureEdeCalculation(testProcedure, baseEDE)).to.equal(expectedValue);
            });
            it ( "returns expected value for Fluoro procedures", function() {
                var testProcedure = { "id": 1, "categoryid": "Fluoro", "scans": 19, "soc": false, "gender": "mixed", "minutes": 2, "ede": 0 };
                var baseEDE = 0.03;
                var expectedValue = 1.14;
                expect(UserDataService.getProcedureEdeCalculation(testProcedure, baseEDE)).to.equal(expectedValue);
            });
        });

        describe ( "getScanCount", function () {

            beforeEach(function() {
                var procedures = [
                                    { "id": 1, "categoryid": "CT", "scans": 3, "soc": false, "gender": "mixed", "ede": 0 },
                                    { "id": 1, "categoryid": "XRay",   "scans": 9, "soc": false, "gender": "mixed", "ede": 0 },
                                    { "id": 1, "categoryid": "NM", "scans": 11, "soc": false, "gender": "mixed", "injectedDose": 2, "ede": 0 },
                                    { "id": 1, "categoryid": "Fluoro", "scans": 19, "soc": false, "gender": "mixed", "minutes": 2, "ede": 0 }
                                ];
                UserDataService.updateProcedures(procedures);
            });

            it ( "returns zero when given an invalid formId", function () {
                var categoryId = "badId";
                var expected = 0;
                expect(expected).to.equal(UserDataService.getScanCount(categoryId));
            });

            it ( "returns correct value for given formId", function () {
                var categoryId = "XRay";
                var expected = 9;
                expect(expected).to.equal(UserDataService.getScanCount(categoryId));
            });
        });
        
    }
    
);