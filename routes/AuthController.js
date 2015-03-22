"use strict";

var config = require("../config");
var models = require("../models");
var services = require("../services");
var AuthController = {};

//initialize authentication strategies
AuthController.initStrategies = function(
  passport,
  passportLocal,
  BasicStrategy,
  ClientPasswordStrategy,
  BearerStrategy,
  oauth2orize
){
  passport.serializeUser(function(user, callback){
    callback(null, user.id);
  });
  passport.deserializeUser(function(id, callback){
    findById(id, callback);
  });

  passport.use("local", new passportLocal.Strategy(verifyCredentials));
  passport.use("basic", new BasicStrategy(clientStrategyLogic));
  passport.use("client", new ClientPasswordStrategy(clientStrategyLogic));
  passport.use("bearer", new BearerStrategy(bearerStrategyLogic));

  //AuthController.authenticateLocal = (function(req, res, next){
  //  passport.authenticate("local", function(error, user, info){
  //    failureRedirect: "/login",
  //      failureFlash: false
  //  });
  //})(req, res, next);

  AuthController.authenticateLocal = passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: false
  });

  AuthController.authenticateBearer = passport.authenticate("bearer", { session: false });

  AuthController.isLocalAuthenticated = function(req, res, next){
    req.isAuthenticated()? next() : res.redirect("/login");
  }

  oauth2TokenExchangeLogic(passport, oauth2orize);
}

AuthController.getSignIn = function(req, res){
  res.render("auth/login", { title: "Welcome back!" });
}
AuthController.getSignUp = function(req, res){
  res.render("auth/join", { title: "Join WallOfSound" });
}
AuthController.postSignIn = function(req, res){
  res.redirect("/");
}
AuthController.postSignUp = function(req, res){
  console.log(req.body);
  if(typeof req.body.email !== "undefined"
    && typeof req.body.password !== "undefined"){
    createUser(req.body.email, req.body.password, function(error){
      if(error){
        res.status(400).send(error);
      }else{
        res.redirect("/");
      }
    })
  }else{
    res.status(400).send("Bad request");
  }
}
AuthController.getSignOut = function(req, res){
  req.logout();
  res.redirect("/");
}
module.exports = AuthController;

/**
 * verify credentials on sign up
 * @param email
 * @param password
 * @param callback
 */
function verifyCredentials(email, password, callback){
  models.User.find({ where: { email: email }})
    .on("success", function(user){
      if(user === null){
        callback(null, false);
      }else{
        services.BCrypt.verifyPassword(password, user.get().password, function(error, isMatch){
          if(error){
            callback(error);
          }else if(!isMatch){
            callback(null, false);
          }else{
            callback(null, user.get());
          }
        });
      }
    });
}

/**
 * create new user record in database
 * @param email
 * @param password
 * @param callback
 */
function createUser(email, password, callback){
  models.User.find({ where: { email: email }})
    .on("success", function(user){
      if(user !== null){ //user with such email is already registered
        callback("Email is already in use");
      }else{
        //hash password
        services.BCrypt.hashPassword(password, function(error, hash){
          if(error){
            callback(error);
          }else{
            //create record in database
            models.User.create({ email: email, password: hash, role: 0 })
              .then(function(user){
                callback(null, user);
              });
          }
        });
      }
    });
}

function findById(id, callback){
  models.User.find(id)
    .then(function(user){
      if(!user){
        callback(null, false);
      }else{
        callback(null, user.get());
      }
    });
}

function clientStrategyLogic(username, password, callback){
  models.Client.find({ where: { clientId: username }})
    .on("success", function(client){
      if(!client){
        callback(null, false);
      }else{
        //ToDo: add hashed password for client
        //services.BCrypt.verifyPassword(password, client.clientSecret, function(error, isMatch){
        //  if(error){
        //    callback(error, false);
        //  }else if(!isMatch){
        //    callback(null, isMatch);
        //  }else{
            callback(null, client.get());
        //  }
        //});
      }
    });
}

function bearerStrategyLogic(token, callback){
  models.AccessToken.find({ where: { token: token }})
    .on("success", function(accessToken){
      if(!accessToken){
        callback(null, false)
      }else{
        //delete token from DB if it is expired
        var createdAt = accessToken.get().createdAt;
        var expirationTime = Math.round(Date.now() - createdAt) / 1000;
        if(Math.round(Date.now() - createdAt) / 1000 > config.AppConfig.security.tokenLife){
          models.AccessToken.destroy({ where: { token: token }})
            .on("success", function(){
              console.log(arguments);
              callback(new Error("token expired"), false, { message: "token expired" });
            });
        }else{
          //search user in DB
          models.User.find(accessToken.get().UserId)
            .on("success", function(user){
              if(!user){
                callback(null, false);
              }else{
                callback(null, user, { scope: "*" });
              }
            });
        }
      }
    })
}

function oauth2TokenExchangeLogic(passport, oauth2orize){
  var server = oauth2orize.createServer();
  server.exchange(oauth2orize.exchange.password(function(client, email, password, scope, callback){
    verifyCredentials(email, password, function(error, user){
      if(error){
        callback(error);
      }else if(!user){
        callback(null, false);
      }else{
        models.RefreshToken.destroy({ where: { UserId: user.id, ClientId: client.id }});
        models.AccessToken.destroy({ where: { UserId: user.id, ClientId: client.id }});

        var tokenValue = services.UID.generate(32).toString("base64");
        var refreshTokenValue = services.UID.generate(32).toString("base64");

        models.RefreshToken.create({ token: refreshTokenValue, ClientId: client.id, UserId: user.id })
          .then(function(){
            models.AccessToken.create({ token: tokenValue, ClientId: client.id, UserId: user.id })
              .then(function(){
                callback(null, tokenValue, refreshTokenValue, { expires_in: config.AppConfig.security.tokenLife });
              });
          });
      }
    });
  }));

  server.exchange(oauth2orize.exchange.refreshToken(function(client, token, scope, callback){
    models.RefreshToken.find({ where: { token: token }})
      .on("success", function(refreshToken){
        if(!refreshToken){
          callback(null, false);
        }else{
          models.User.find(refreshToken.get().UserId)
            .on("success", function(user){
              if(!user){
                callback(null, false);
              }else{
                models.RefreshToken.destroy({ where: { UserId: user.id, ClientId: client.id }});
                models.AccessToken.destroy({ where: { UserId: user.id, ClientId: client.id }});

                var tokenValue = services.UID.generate(32).toString("base64");
                var refreshTokenValue = services.UID.generate(32).toString("base64");

                models.RefreshToken.create({ token: refreshTokenValue, ClientId: client.id, UserId: user.id })
                  .then(function(){
                    models.AccessToken.create({ token: tokenValue, ClientId: client.id, UserId: user.id })
                      .then(function(){
                        callback(null, tokenValue, refreshTokenValue, { expires_in: config.AppConfig.security.tokenLife });
                      });
                  });
              }
            });
        }
      });
  }));

  //token endpoint
  AuthController.token = [
    passport.authenticate(["basic", "client"], { session: false }),
    server.token(),
    server.errorHandler()
  ];
}