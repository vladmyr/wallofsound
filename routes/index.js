"use strict";

var fs = require("fs");
var path = require("path");
var controllers = {};

fs.readdirSync(__dirname)
  .filter(function(file){
    return fs.lstatSync(path.join(__dirname,file)).isFile() && (file !== "index.js" && (file.indexOf(".") !== 0));
  })
  .forEach(function(file){
    var controllerName = path.basename(file, path.extname(file));
    controllers[controllerName] = require(path.join(__dirname, file));
  });

module.exports = controllers;