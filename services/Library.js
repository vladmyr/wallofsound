"use strict";

var models = require("../models");
var Library = {};

Library.list = function(userId, callback){
  if(typeof callback === "function"){
    models.AudioFileMeta.findAll({
      include: [{
        model: models.Album,
        include: [{
          model: models.Artist
        }]
      }],
      where: {
        UserId: userId
      }
    }).then(callback);
  }
}

module.exports = Library;