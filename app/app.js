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

        .state("report-formatted", {
            url: "/report-formatted",
            templateUrl: "views/partial-report-formatted.html"
        })

        .state("report-plaintext", {
            url: "/report-plaintext",
            templateUrl: "views/partial-report-plaintext.html"
        });
        
        // .state("report", {
        //     url: "/report",
        //     views: {

        //         // the main template
        //         "": {
        //             templateUrl: "views/partial-report.html",
        //         },

        //         "formatted@report": {
        //             templateUrl: "views/partial-report-formatted.html"
        //         },

        //         "plaintext@report": {
        //             templateUrl: "views/partial-report-plaintext.html"
        //         }
        //     }
        // })

        // .state("report.formatted", {
        //     url: "/report-formatted",
        //     templateUrl: "views/partial-report-formatted.html"
        // })

        // .state("report.plaintext", {
        //     url: "/report-plaintext",
        //     templateUrl: "views/partial-report-plaintext.html"
        // });
});