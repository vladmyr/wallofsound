"use strict";

var fs = require("fs");
var path = require("path");
var config = {};

fs.readdirSync(__dirname)
  .filter(function(file){
    return file.indexOf(".") !== 0 && (file !== "index.js")
  })
  .forEach(function(file){
    var configName = path.basename(file, path.extname(file));
    config[configName] = require(path.join(__dirname, file));
  });

module.exports = config;