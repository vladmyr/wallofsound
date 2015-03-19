PROJECT_ROOT = __dirname;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");
var passportLocal = require("passport-local");
var session = require("express-session");
var formidable = require("formidable");
var router = express.Router();

//var Upload = require("blueimp-file-upload-expressjs");

var config = require("./config");
var routes = require('./routes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
  secret: "secret",
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());
routes.AuthController.initStrategies(passport, passportLocal);
routes.LibraryController.initFormidable(formidable, config.FileUploadConfig.audio);

//routing
router.route("/")
  .get(routes.HomeController.getIndex);
router.route("/login")
  .get(routes.AuthController.getSignIn)
  .post(routes.AuthController.isLocalAuthenticated, routes.AuthController.postSignIn);
router.route("/join")
  .get(routes.AuthController.getSignUp)
  .post(routes.AuthController.postSignUp);
router.route("/logout")
  .get(routes.AuthController.getSignOut);
router.route("/library/upload")
  .post(routes.LibraryController.postUpload);

app.use('/', router);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
