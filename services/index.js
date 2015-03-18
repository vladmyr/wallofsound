"use strict";

var fs = require("fs");
var path = require("path");
var services = {};

fs.readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf(".") !== 0 && (file !== "index.js"));
  })
  .forEach(function(file){
    var serviceName = path.basename(file, path.extname(file));
    services[serviceName] = require(path.join(__dirname, file));
  });

module.exports = services;