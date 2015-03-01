/* config */
require("./config/UrlMapping");
require("./config/MongoConfig");

/* domain */
require("./domain/enum/UserRoleEnum");
require("./domain/User");
require("./domain/Client");
require("./domain/OAuth2Code");
require("./domain/AccessToken");

/* global vars */
fs = require("fs");
mongoose = require("mongoose");
bcrypt = require("bcrypt-nodejs");
passport = require("passport");
BasicStrategy = require("passport-http").BasicStrategy;
BearerStrategy = require("passport-http-bearer").Strategy;
OAuth2orize = require("oauth2orize");

var http = require('http');
var debug = require('debug')('wallofsound01:server');
var port = normalizePort(process.env.PORT || '3000');
var express = require('express');
var session = require("express-session");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require("hogan-express-partials");
var helmet = require("helmet");
var router = express.Router();

/* schemas */
require("./data/models/UserModel");
require("./data/models/ClientModel");
require("./data/models/AccessTokenModel");
require("./data/models/OAuth2CodeModel");

/* repositories */
require("./data/repositories/UserRepository");
require("./data/repositories/ClientRepository");
require("./data/repositories/AccessTokenRepository");
require("./data/repositories/OAuth2CodeRepository");

/* db initializer */
require("./data/initializers/DatabaseInitializer");

var app = express();
var server = http.createServer(app);

/* controllers */
var indexController = require("./routes/IndexController");
var clientController = require("./routes/ClientController");
var authController = require("./routes/AuthController");
var oAuth2Controller = require("./routes/OAuth2Controller");

app.use(helmet());

app.use(passport.initialize());

app.set('port', port);
app.set("env", "development");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.set("layout", "layout/default");
app.engine("html", require("hogan-express"));
app.use(partials.middleware());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //false
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "Super Secret Session Key",
    saveUninitialized: true,
    resave: true
}));

//database
var db = mongoose.connect(
    "mongodb://" + MongoConfig.server() + ":" + MongoConfig.port() + "/" + MongoConfig.database(),
    {
        server: { auto_reconnect: true },
        user: MongoConfig.user(),
        pass: MongoConfig.password(),
        bufferCommands: false
    });
db.connection.on("error", function(error){
    console.log("An error occured while connecting to DB: ", error);
});
db.connection.once("open", function(){
//    DatabaseInitializer.seed();

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
});

router.route(UrlMapping.INDEX)
    .get(indexController.getIndex);
router.route(UrlMapping.SIGN_IN)
    .get(authController.getSignIn);
router.route(UrlMapping.SIGN_UP)
    .get(authController.getSignUp)
    .post(authController.postSignUp);
router.route(UrlMapping.USER)
    .get(authController.isAuthenticated, function(req, res){
        res.send(200);
    });
router.route("/clients")
    .get(authController.isAuthenticated, clientController.getClients)
    .post(authController.isAuthenticated, clientController.postClients);
router.route("/oauth2/authorize")
    .get(authController.isAuthenticated, oAuth2Controller.authorization)
    .post(authController.isAuthenticated, oAuth2Controller.decision);
router.route("/oauth/token")
    .post(authController.isClientAuthenticated, oAuth2Controller.token);

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
    app.set("view cache", false);

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

//internal functions
//Normalize a port into a number, string, or false.
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

//Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}