var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var database       = require('./config/db');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var passport       = require('passport');
var port           = process.env.PORT || 3030;

mongoose.connect(database.url);
require('./app/models/user');
require('./config/passport');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(morgan('dev'));
app.use(passport.initialize());

require('./app/routes')(app);

app.listen(port);
console.log("App listening on port " + port);