var Venue    = require('./models/venue.js').venue;
var User     = require('./models/user.js').user;
var passport = require('passport');
var jwt      = require('express-jwt');
var auth     = jwt({secret: 'SECRET', userProperty: 'payload'});

module.exports = function(app) {
    app.get('/api/venues', function(req, res) {
        Venue.find(function(err, venues) {
            if(err) res.send(err);
            res.json(venues);
        });
    });

    app.post('/api/venues/', auth, function(req, res) {
        Venues.findById(req.body["_id"], function(err, venue) {
            if(err) res.send(err);
            if(venue.length) {
                venue.going = req.body.going;
                option.save(function(err) {
                    if(err) res.send(err);

                    res.json({message: "Success!"});
                });
            } else {
                var venue = new Venues();
                venue.name = req.body.name;
                venue.going = req.body.going;

                venue.save(function(err) {
                    if(err) res.send(err);
                });
            }
        });
    });

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