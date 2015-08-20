var Venue    = require('./models/venue.js').venue;
var User     = require('./models/user.js').user;
var passport = require('passport');
var jwt      = require('express-jwt');
var auth     = jwt({secret: 'SECRET', userProperty: 'payload'});
var yelp     = require('yelp').createClient({
    consumer_key: '4L2iIoI3GZEltc4HHQvgcA',
    consumer_secret: 'G2cmV4F6pUi_3Pu3bCNp3L1Cobg',
    token: 'v4nIUB7KbVqPbndC6m4elsCrSQh3dF6s',
    token_secret: 'FWtyT7tYHEFr6_agupiwqnMPRXo'
});

module.exports = function(app) {
    app.get('/api/yelp/:location', function(req, res) {
        yelp.search({term: 'bar', location: req.params.location}, function(err, data) {
            if(err) res.send(err);
            res.send(data.businesses);
        });
    });

    app.get('/api/venues/:name', function(req, res) {
        Venue.find({name: req.params.name}, function(err, venues) {
            if(err) res.send(err);
            res.json(venues);
        });
    });

    app.get('/api/user/get/venues/:user', function(req, res) {
        User.find({username: req.params.user}, function(err, user) {
            if(err) res.send(err);
            res.send(user[0].venues);
        });
    });

    app.post('/api/venues/up', auth, function(req, res) {
        Venue.find({name:req.body["name"]}, function(err, venue) {
            if(err) res.send(err);
            if(venue) {
                venue[0].going = req.body.going;
                venue[0].save(function(err) {
                    if(err) res.send(err);

                    res.json({message: "Success!"});
                });
            }
        });
    });

    app.post('/api/venues/create', auth, function(req, res) {
        var venue = new Venue();

        venue.name = req.body.name;
        venue.going = req.body.going;

        venue.save(function(err) {
            if(err) res.send(err);
            res.json({message: 'Success!'});
        });
    });

    app.post('/api/user/add/venue', auth, function(req, res) {
        User.find({username: req.body.username},function(err, user) {
            if(err) res.send(err);
            if(user) {
                user[0].venues.push(req.body.venue);
                user[0].save(function(err) {
                    if(err) res.send(err);
                });
            }
        });
    });

    app.post('/api/user/rem/venue', auth, function(req, res) {
        User.find({username: req.body.username},function(err, user) {
            if(err) res.send(err);
            if(user) {
                user[0].venues.splice(user[0].venues.indexOf(req.body.venue), 1);
                user[0].save(function(err) {
                    if(err) res.send(err);
                });
            }
        });
    })

    app.post('/register', function(req, res, next) {
        var user = new User();
        user.username = req.body.username;
        user.setPassword(req.body.password);

        user.save(function(err) {
            if(err) return next(err);

            return res.json({token: user.generateJWT()});
        });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info){
            if(err){ return next(err); }

            if(user){
                return res.json({token: user.generateJWT()});
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
}