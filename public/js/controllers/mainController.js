Nightlife.controller("mainController", function($scope, $http, auth, $location, $window) {

    $scope.logOut     = auth.logOut;
    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.getBusiness = function() {
        $http.get('/api/yelp/'+$scope.city)
            .success(function(data) {
                $scope.venues = data;
                var venuesDb = [];

                $http.get("/api/venues")
                    .success(function(venues) {
                        venuesDb = venues;

                        var venuesDbName = venuesDb.map(function(venue) {
                            return venue.name;
                        });

                        var venuesDbGoing = venuesDb.map(function(venue) {
                            return venue.going;
                        });

                        for(i=0; i<$scope.venues.length; i++) {
                            if(venuesDbName.indexOf($scope.venues[i].name) !== -1) {
                                $scope.venues[i].going = venuesDbGoing[venuesDbName.indexOf($scope.venues[i].name)];
                            } else {
                                $scope.venues[i].going = 0;
                            }
                        }

                        if(auth.isLoggedIn()) {
                            $http.get('/api/user/get/venues/'+auth.currentUser())
                                .success(function(userVenues) {
                                    for(i=0; i<$scope.venues.length; i++) {
                                        if(userVenues.indexOf($scope.venues[i].name) !== -1) {
                                            $scope.venues[i].u = true;
                                        } else {
                                            $scope.venues[i].u = false;
                                        }
                                    }
                                })
                                .error(function(err) {
                                    console.log("Error: " + err);
                                });
                        }
                    })
                    .error(function(err) {
                        console.log("Error: " + err);
                    });
            })
            .error(function(err) {
                console.log("Error: " + err);
            });
    };

    $scope.addGoing = function(venue) {
        if(auth.isLoggedIn()) {
            var user = {
                username: auth.currentUser(),
                venue: venue.name
            }

            if(venue.u == true) {
                venue.going -= 1;
                venue.u = false;
            } else if(venue.u == false) {
                venue.going += 1;
                venue.u = true;
            }

            $http.get('/api/venues')
                .success(function(venuesDb) {
                    var venuesDbName = venuesDb.map(function(venue) {
                        return venue.name;
                    });

                    if(venuesDbName.indexOf(venue.name) === -1) {
                        $http.post('/api/venues/create', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                            .success(function(venueDB) {
                                if(venue.u == true) {
                                    $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function(venueDB) {
                                            console.log("Successfully downvoted!");
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err)
                                        });

                                    $http.post('/api/user/rem/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function() {
                                            console.log("Successfully removed venue!");
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err);
                                        });
                                } else {
                                    $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function(venueDB) {
                                            console.log("Successfully upvoted!");
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err)
                                        });

                                    $http.post('/api/user/add/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                        .success(function() {
                                            console.log("Successfully added venue!");
                                        })
                                        .error(function(err) {
                                            console.log("Error: " + err);
                                        });
                                }
                            })
                            .error(function(err) {
                                console.log("Error: " + err)
                            });
                    } else {
                        if(venue.u == true) {
                            $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                .success(function(venueDB) {
                                    console.log("Successfully downvoted!");
                                })
                                .error(function(err) {
                                    console.log("Error: " + err)
                                });

                            $http.post('/api/user/rem/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                .success(function() {
                                    console.log("Successfully removed venue!");
                                })
                                .error(function(err) {
                                    console.log("Error: " + err);
                                });
                        } else {
                            $http.post('/api/venues/up', venue, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                .success(function(venueDB) {
                                    console.log("Successfully upvoted!");
                                })
                                .error(function(err) {
                                    console.log("Error: " + err)
                                });

                            $http.post('/api/user/add/venue', user, {headers:{Authorization: 'Bearer '+auth.getToken()}})
                                .success(function() {
                                    console.log("Successfully added venue!");
                                })
                                .error(function(err) {
                                    console.log("Error: " + err);
                                });
                        }
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