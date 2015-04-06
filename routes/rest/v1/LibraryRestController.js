"use strict";

var services = require("../../../services");
var LibraryRestController = {};

LibraryRestController.getLibrary = function(req, res){
  if(req.isAuthenticated()){
    services.Library.list(req.user.id, function(rows){
      res.json(rows);
    });
  }else{
    res.status(403).send("You are not authenticated");
  }
}

module.exports = LibraryRestController;