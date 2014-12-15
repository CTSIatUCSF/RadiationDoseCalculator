angular.module("RadCalc.controllers", []);
angular.module("RadCalc.services", []);
angular.module("RadCalc.directives", []);
angular.module("RadCalc.filter", []);

var app = angular.module("RadCalc", [
    "ui.router",
    "ui.bootstrap",
    "RadCalc.services",
    "RadCalc.controllers",
    "RadCalc.directives",
    "RadCalc.filter"
]);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/");
    
    $stateProvider
        
        .state("data-entry", {
            controller: "DataEntryCtrl",
            url: "/",
            templateUrl: "views/partial-data-entry.html",
            resolve: {
                "storedDataService":function(StoredDataService) {
                    return StoredDataService.promise;
                }
            }
        })

        .state("json-editor", {
            url: "/json-editor",
            controller: "JsonEditCtrl",
            templateUrl: "views/partial-json-editor.html",
            resolve: {
                "storedDataService":function(StoredDataService) {
                    return StoredDataService.promise;
                }
            }
        })

        .state("report-formatted", {
            url: "/report-formatted",
            templateUrl: "views/partial-report-formatted.html"
        })

        .state("report-plaintext", {
            url: "/report-plaintext",
            templateUrl: "views/partial-report-plaintext.html"
        });
});