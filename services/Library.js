"use strict";

var models = require("../models");
var Library = {};

Library.list = function(userId, callback){
  if(typeof callback === "function"){
    models.AudioFileMeta.findAndCountAll({
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

Library.getFilePath = function(userId, trackId, callback){
  models.AudioFileMeta.find({
    where: {
      id: trackId,
      UserId: userId
    }
  }).then(function(track){
    callback(track.filePath);
  });
}

module.exports = Library;