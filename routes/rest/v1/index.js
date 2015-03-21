"use strict";

var fs = require("fs");
var path = require("path");
var restControllerV1 = {};

fs.readdirSync(__dirname)
  .filter(function(file){
    return file.indexOf(".") !== 0 && (file !== "index.js");
  })
  .forEach(function(file){
    var restControllerName = path.basename(file, path.extname(file));
    restControllerV1[restControllerName] = require(path.join(__dirname, file));
  });

module.exports = restControllerV1;