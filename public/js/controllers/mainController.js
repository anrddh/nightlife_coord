Nightlife.controller("mainController", function($scope, $http, auth, $location, $window) {
    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.getBusiness = function() {
        $http.get('/api/yelp/'+$scope.city)
            .success(function(data) {
                $scope.venues = data.map(function(venue) {
                    $http.get("/api/venues/"+venue.name)
                        .success(function(venueDB) {
                            if(venueDB.length) {
                                venue.going = venueDB[0].going;
                            } else {
                                venue.going = 0;
                            };
                        })
                        .error(function(err) {
                            console.log("Error: " + err);
                        });
                    return venue;
                });
            })
            .error(function(err) {
                console.log(err);
            });
    };

    $scope.addGoing = function(venue) {
        if(auth.isLoggedIn()) {
            $http.get('/api/venues/' + venue.name)
                .success(function(data) {
                    if(data.length) {
                        venue.going += 1;
                        $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                            .success(function(venueDB) {
                                console.log(venueDB);
                            })
                            .error(function(err) {
                                console.log("Error: " + err)
                            });
                    } else {
                        venue.going += 1;
                        $http.post('/api/venues/create', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                            .success(function() {
                                console.log("Success!");
                            })
                            .error(function(err) {
                                console.log("Error: " + err);
                            });
                    }
                })
                .error(function(err) {
                    console.log("Error: " + err);
                });
        } else {
            $location.path('/login');
        }
    };
});