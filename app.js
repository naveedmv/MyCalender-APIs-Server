var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var connector = require('./connector');
mongoose.connect(connector.url);

var methodOverride = require('method-override');

var app = express();
// setting path for client side views pending by naveed
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

var passport = require('passport');
var expressSession = require('express-session');
// secret can be anything
app.use(expressSession({secret: 'abcde', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./init');
initPassport(passport);

var flash = require('connect-flash');
app.use(flash());

var routes = require('./routes/index')(passport);
app.use('/', routes);
//app.use('/events', events);

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


module.exports = app;