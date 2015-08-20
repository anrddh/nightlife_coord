Nightlife.controller("mainController", function($scope, $http, auth, $location, $window) {

    $scope.logOut     = auth.logOut;
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

                    $http.get('/api/user/get/venues/' +auth.currentUser())
                        .success(function(venueDB) {
                            if(venueDB.indexOf(venue.name) !== -1) {
                                venue.u = true;
                            }
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
            var user = {
                username: auth.currentUser(),
                venue: venue.name
            }

            $http.get('/api/venues/' + venue.name)
                .success(function(data) {
                    if(data.length) {
                        $http.get('/api/user/get/venues/'+auth.currentUser())
                            .success(function(venues) {
                                if(venues.indexOf(venue.name) !== -1) {
                                    venue.going -= 1;
                                    venue.u = false;
                                    $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function(venueDB) {
                                            console.log(venueDB);
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err)
                                        });
                                    $http.post('/api/user/rem/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function() {
                                            console.log("Success!");
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err);
                                        });
                                } else {
                                    venue.going += 1;
                                    venue.u = true;
                                    $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function(venueDB) {
                                            console.log(venueDB);
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err)
                                        });
                                    $http.post('/api/user/add/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
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
                        venue.going += 1;
                        venue.u = true;
                        $http.post('/api/venues/create', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                            .success(function() {
                                console.log("Success!");
                            })
                            .error(function(err) {
                                console.log("Error: " + err);
                            });
                        $http.post('/api/user/add/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
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