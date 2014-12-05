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
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state("dataEntry", {
            controller: "ReportCtrl",
            url: "/",
            templateUrl: "views/partial-dataEntry.html",
            resolve: {
                "storedDataService":function(StoredDataService) {
                    return StoredDataService.promise;
                }
            }
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state("report", {
            url: "/report",
            templateUrl: "views/partial-report.html"
        });
});