var Nightlife = angular.module('Nightlife', ['ngRoute']);

Nightlife.factory('auth', ['$http', '$window', '$location', function($http, $window, $location) {
    var auth = {};

    auth.saveToken = function(token) {
        $window.localStorage['tok'] = token;
    };

    auth.getToken = function() {
        return $window.localStorage['tok'];
    };

    auth.isLoggedIn = function() {
        var token = auth.getToken();

        if(token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function() {
        $window.localStorage.removeItem('tok');
        $location.path('/');
    };

    return auth;
}]);

Nightlife.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../views/home.html',
            controller: 'mainController'
        })

        .when('/login', {
            templateUrl: '../views/login.html',
            controller: 'authController'
        })

        .when('/register', {
            templateUrl: '../views/register.html',
            controller: 'authController'
        });
});