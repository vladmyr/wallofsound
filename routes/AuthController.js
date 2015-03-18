"use strict";

var models = require("../models");
var services = require("../services");
var AuthController = {};

//initialize authentication strategies
AuthController.initStrategies = function(passport, passportLocal){
  passport.serializeUser(function(user, callback){
    callback(null, user.id);
  });
  passport.deserializeUser(function(id, callback){
    findById(id, callback);
  });

  passport.use("local", new passportLocal.Strategy(verifyCredentials));

  AuthController.isLocalAuthenticated = passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  });
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
    createUser(req.body.email, req.body.password, function(error, user){
      if(error){
        res.status(400).send(error);
      }else{
        res.status(200).send(user.get());
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
  models.User.find({ where: {email: email }})
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