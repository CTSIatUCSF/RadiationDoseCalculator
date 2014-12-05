angular.module("RadCalc.controllers", []);
angular.module("RadCalc.services", []);
angular.module("RadCalc.directives", []);

var app = angular.module("RadCalc", [
    "ui.router",
    "RadCalc.services",
    "RadCalc.controllers",
    "RadCalc.directives"
]);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/");
    
    $stateProvider
        
        .state("data-entry", {
            controller: "ReportCtrl",
            url: "/",
            templateUrl: "views/partial-data-entry.html",
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