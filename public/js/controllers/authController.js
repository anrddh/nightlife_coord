Nightlife.controller("authController", ['$scope', 'auth', '$location', function($scope, auth, $location) {
    $scope.user = {};

    if(auth.isLoggedIn()) {
        $location.path('/');
    }

    $scope.register = function() {
        auth.register($scope.user)
            .error(function(err) {
                $scope.error = err;
            })
            .then(function() {
                $location.path('/');
            });
    };

    $scope.logIn = function() {
        auth.logIn($scope.user)
            .error(function(err) {
                $scope.error = err;
            })
            .then(function() {
                if(auth.isLoggedIn()) {
                    $location.path('/');
                }
            });
    };
}]);