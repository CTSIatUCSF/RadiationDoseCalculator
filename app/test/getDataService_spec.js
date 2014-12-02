/*jshint expr: true*/
/*jshint -W008 */

describe ( "Get Data Service", function () {

        var getDataService;
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

        beforeEach(inject(function (_getDataService_) {
            getDataService = _getDataService_;
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
            getDataService.data().then(function (response) {
                expect(testdata).to.deep.equal(response.data);
            }, function (error) {
                console.error(error);
            });
        });

        it ( "getAllProcedures returns array of procedures", function() {
            var categoryId = "CT";
            var expectedCount = 2;
            getDataService.data().then(function (response) {
                var data = getDataService.getAllProcedures(categoryId);
                expect(expectedCount).to.equal(data.length);
            }, function (error) {
                console.error(error);
            });
        });

        it ("getProcedure returns a procedure object", function() {
            var categoryId = "NM";
            var procedureName = "Abdominal CT slngle slice";
            getDataService.data().then(function (response) {
                var data = getDataService.getProcedure(categoryId, procedureName);
                expect(data.name).to.equal(procedureName);
            }, function (error) {
                console.error(error);
            });
        });

        it ("getAllProcedureProperties returns an array of procedure properties", function() {
            var categoryId = "NM";
            var procedureName = "Abdominal CT with AND without constrast";
            var expectedCount = 3;
            getDataService.data().then(function (response) {
                var data = getDataService.getAllProcedureProperties(categoryId, procedureName);
                expect(data.length).to.equal(expectedCount);
            }, function (error) {
                console.error(error);
            });
        }); 

        it ("getProcedurePropertyValue returns the correct property value", function() {
            var categoryId = "CT";
            var procedureName = "Abdominal CT with AND without constrast";
            var genderName = "female";
            var expectedValue = 7.8;
            getDataService.data().then(function (response) {
                var data = getDataService.getProcedurePropertyValue(categoryId, procedureName, genderName);
                expect(data).to.equal(expectedValue);
            }, function (error) {
                console.error(error);
            });
        });
    }
);