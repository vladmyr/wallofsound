"use strict";

var UID = {};

UID.generate = function(length){
  var buffer = [];
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++){
    buffer.push(chars[getRandomInt(0, chars.length - 1)]);
  }
  return buffer.join("");
}

module.exports = UID;

function getRandomInt(min, max){
  return Math.floor(Math.random * (max - min + 1)) + min;
}