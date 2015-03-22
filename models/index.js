"use strict";

var fs = require("fs");
var path = require("path");
//var env = ...
//var config = ...
var db = {};
var Sequelize = require("sequelize");

var sequelize = new Sequelize("wallofsound", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    min: 0,
    max: 20,
    idle: 10000
  }
});

fs.readdirSync(__dirname)
  .filter(function(file){
    return fs.lstatSync(path.join(__dirname, file)).isFile() &&(file.indexOf(".") !== 0 && (file !== "index.js"));
  })
  .forEach(function(file){
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName){
  if("associate" in db[modelName]){
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;