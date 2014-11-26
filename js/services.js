angular.module("RadCalc.services", []).factory("getDataService", function($q, $http) {
  return {
    getData: function() {
      var deferred = $q.defer(),
          httpPromise = $http.get("/js/data.json");

      httpPromise.then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        console.error(error);
      });

      return deferred.promise;
    }
  };
});