Nightlife.controller("mainController", function($scope, $http, auth, $location) {
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    $scope.getBusiness = function() {
        var method = 'GET';
        var url    = 'http://api.yelp.com/v2/search';

        var params = {
            callback: 'angular.callbacks._0',
            oauth_consumer_key: '4L2iIoI3GZEltc4HHQvgcA',
            oauth_token: 'v4nIUB7KbVqPbndC6m4elsCrSQh3dF6s',
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: new Date().getTime(),
            oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            location: $scope.city,
            term: 'bar'
        };

        var consumerSecret = 'G2cmV4F6pUi_3Pu3bCNp3L1Cobg';
        var tokenSecret    = 'FWtyT7tYHEFr6_agupiwqnMPRXo';
        var signature      = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encoded: false});

        params['oauth_signature'] = signature;

        $http.jsonp(url, {params: params})
            .success(function(venue) {
                $scope.venues = venue.businesses.map(function(item) {
                    item.going = 0;
                    return item;
                });
            })
            .error(function(err) {
                console.log("Error: " + err);
            });
    };

    $scope.addGoing = function(venue) {
        if(auth.isLoggedIn()) {
            venue.going += 1;
        } else {
            $location.path('/login');
        }
    };
});