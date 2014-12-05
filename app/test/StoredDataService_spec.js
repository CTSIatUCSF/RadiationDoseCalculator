/*jshint expr: true*/
/*jshint -W008 */

describe ( "Stored Data Service", function () {

        var StoredDataService;
        var $httpBackend;
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

        beforeEach(inject(function (_StoredDataService_) {
            StoredDataService = _StoredDataService_;
        }));

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get( "$httpBackend" );
            $httpBackend.when("GET", "/js/data.json").respond(200, testdata);
        }));

        afterEach(function () {
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it ( "loads data", function() {
            StoredDataService.promise.success(function(data) {
                expect(testdata).to.deep.equal(data);
            }).error(function(err) {
                console.error(err);
            });
        });

        it ( "getAllProcedures returns array of procedures", function() {
            var categoryId = "CT";
            var expectedCount = 2;
            StoredDataService.promise.success(function(data) {
                var allProcedures = StoredDataService.getAllProcedures(categoryId);
                expect(expectedCount).to.equal(allProcedures.length);
            }).error(function(err) {
                console.error(err);
            });
        });

        it ("getProcedure returns a procedure object", function() {
            var categoryId = "NM";
            var procedureName = "Abdominal CT slngle slice";
            StoredDataService.promise.success(function(data) {
                var procedure = StoredDataService.getProcedure(categoryId, procedureName);
                expect(procedure.name).to.equal(procedureName);
            }).error(function(err) {
                console.error(err);
            });
        });

        it ("getAllProcedureProperties returns an array of procedure properties", function() {
            var categoryId = "NM";
            var procedureName = "Abdominal CT with AND without constrast";
            var expectedCount = 3;
            StoredDataService.promise.success(function(data) {
                var allProcedureProperties = StoredDataService.getAllProcedureProperties(categoryId, procedureName);
                expect(allProcedureProperties.length).to.equal(expectedCount);
            }).error(function(err) {
                console.error(err);
            });
        });

        it ("getProcedurePropertyValue returns the correct property value", function() {
            var categoryId = "CT";
            var procedureName = "Abdominal CT with AND without constrast";
            var genderName = "female";
            var expectedValue = 7.8;
            StoredDataService.promise.success(function(data) {
                var actualValue = StoredDataService.getProcedurePropertyValue(categoryId, procedureName, genderName);
                expect(actualValue).to.equal(expectedValue);
            }).error(function(err) {
                console.error(err);
            });
        });

});