Nightlife.controller("mainController", function($scope, $http) {
    $scope.getBusiness = function() {
        $http.get({method: 'JSONP', url: "http://api.yelp.com/v2/search?term=bar&location=" + $scope.city})
            .success(function(venues) {
                console.log(venues);
            })
            .error(function(err) {
                console.log("Error: " + err);
            });
        console.log($scope.city);
    };
});