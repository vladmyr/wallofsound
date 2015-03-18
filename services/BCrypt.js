"use strict";

var bcrypt = require("bcrypt-nodejs");
var BCrypt = {};

BCrypt.hashPassword = function(password, callback){
  bcrypt.genSalt(10, function(error, salt){
    if(error){
      callback(error);
    }else{
      bcrypt.hash(password, salt, null, function(error, hash){
        if(error){
          callback(error);
        }else{
          callback(null, hash);
        }
      });
    }
  });
}

BCrypt.verifyPassword = function(password, hash, callback){
  bcrypt.compare(password, hash, function(error, isMatch){
    if(error){
      callback(error);
    }else{
      callback(null, isMatch);
    }
  });
}

module.exports = BCrypt;