"use strict";

var services = require("../services");
var HomeController = {};

HomeController.getIndex = function(req, res){
  var model = new services.Model(req);
  model.title = "WallOfSound";
  res.render("index", model);
}

module.exports = HomeController;