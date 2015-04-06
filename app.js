PROJECT_ROOT = __dirname;

var fs = require("fs");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require("passport");
var passportLocal = require("passport-local");
var passportHttp = require("passport-http");
var passportHttpBearer = require("passport-http-bearer");
var passportOAuth2ClientPassword = require("passport-oauth2-client-password");
var oauth2orize = require("oauth2orize");

var io = require("socket.io")();
var binaryServer = require("binaryjs").createServer();
var ioStream = require("socket.io-stream");

var session = require("express-session");
var formidable = require("formidable");
var musicMetaData = require("musicmetadata");
var router = express.Router();
var config = require("./config");
var services = require("./services");
var routes = require('./routes');
var routesRestV1 = require("./routes/rest/v1");
var app = express();

app.io = io;
app.binaryServer = binaryServer;

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
  resave: true,
  cookie: {
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

services.Authentication.init(
  passport,
  passportLocal,
  passportHttp.BasicStrategy,
  passportOAuth2ClientPassword.Strategy,
  passportHttpBearer.Strategy,
  oauth2orize);
//routes.AuthController.initStrategies(
//  passport,
//  passportLocal,
//  passportHttp.BasicStrategy,
//  passportOAuth2ClientPassword.Strategy,
//  passportHttpBearer.Strategy,
//  oauth2orize);
routes.LibraryController.initFormidable(formidable, config.FileUploadConfig.audio);
routes.LibraryController.setMusicMetadata(musicMetaData);

//routing
router.route("/")
  .get(routes.HomeController.getIndex);
router.route("/login")
  .get(routes.AuthController.getSignIn)
  .post(services.Authentication.authenticateLocal, routes.AuthController.postSignIn);
router.route("/join")
  .get(routes.AuthController.getSignUp)
  .post(routes.AuthController.postSignUp);
router.route("/logout")
  .get(routes.AuthController.getSignOut);
router.route("/library")
  .get(services.Authentication.isLocalAuthenticated, routes.LibraryController.getLibrary);
router.route("/library/upload")
  .get(services.Authentication.isLocalAuthenticated, routes.HomeController.getIndex)
  .post(routes.LibraryController.postUpload);
router.route("/api/v1/library/list")
  .get(routesRestV1.LibraryRestController.getLibrary);
router.route("/api/v1/user")
  .get(services.Authentication.authenticateBearer, function(req, res){
    res.json({ userId: req.user.userId, email: req.user.email, scope: req.authInfo.scope });
  });
router.route("/token")
  .post(services.Authentication.token);

//socket handling
binaryServer.listen(3001).on("connection", function(client){
  console.log(client);
  client.on("stream", function(stream, meta){
    meta = JSON.parse(meta);
    switch(meta.event){
      case 0:
        //ToDo: client token validation
        services.Library.getFilePath(meta.token.userId, meta.trackId, function(path){
          var rstream = fs.createReadStream(path);
          client.send(rstream, JSON.stringify({ event: 0 }));
        });
        break;
      case 1:
        client.send({}, JSON.stringify({ event: 1, message: "message" }));
        break;
    }
    //console.log("message", data, meta);
  });
});


//io.set("authorization", function(){
//  console.log(arguments);
//});
//io.sockets
//  .on("connection", function(socket){
//    //socket.emit("hello", { hello: "world" });
//    //console.log("connected");
//    //socket.on("event01", function(data){
//    //  console.log(data);
//    //});
//    //io.on("reqStream", function(data){
//    //
//    //  ioStream(socket).emit("resStream", stream);
//    //  rstream.pipe(stream);
//    //});
//
//    var rstream = fs.createReadStream("/home/vladmyr/Development/js/wallofsound02/uploads/1/upload_1f3e95ff327bca40094f5ccfe03cbc97.mp3", { encoding: "base64" });
//    var stream = ioStream.createStream({ highWaterMark: 2 * 1024 * 1024, encoding: "base64" });
//    ioStream(socket).emit("resStream", stream);
//    rstream.pipe(stream);
//
//    socket.on("disconnect", function(){
//      console.log("disconnected");
//    });
//  });


app.use('/', router);

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
