"use strict";

var fs = require("fs");
var path = require("path");
var services = require("../services");
var models = require("../models");
var LibraryController = {};

LibraryController.initFormidable = function(formidable, options){
  LibraryController.formidable = formidable;
  LibraryController.formidableOptions = options;
}

LibraryController.setMusicMetadata = function(musicMetaData){
  LibraryController.musicMataData = musicMetaData;
}

LibraryController.postUpload = function(req, res){
  var form = new LibraryController.formidable.IncomingForm();
  form.multiples = false;

  form.parse(req, function(error, fields, files){
    console.log(error, fields, files);
    proceedFile(0, files.file, function(error){
      if(error){
        res.status(500).send(error);
      }else{
        res.status(200).send();
      }
    });
  });
}

module.exports = LibraryController;

function proceedFile(userId, file, callback){
  var filename = path.basename(file.path) + path.extname(file.name);
  //obtain metadata
  LibraryController.musicMataData(fs.createReadStream(file.path), { duration: true }, function(error, metadata){
    if(error){
      fs.unlink(file.path, function(){
        callback(error);
      });
    }else{
      //save file
      services.FileManager.saveFileFromReadStream(path.join(__dirname, "../uploads", userId + ""), fs.createReadStream(file.path), filename, function(error){
        fs.unlink(file.path, function(){
          callback(error);
        });

        if(error){
          callback(error);
        }else{
          console.log(metadata);

          //save to DB
          //ToDo: add validation
          models.AudioFileMeta.create({
            title: metadata.title !== "" ? metadata.title : file.name,
            trackNo: 0,
            duration: 0,
            filePath: path.join(__dirname, "../uploads", userId + "", filename)
          }).then(function(audioFileMeta){
            models.Artist.findOrCreate({ where: { name: metadata.artist[0] }})
              .spread(function(artist){
                models.Album.findOrCreate({
                  where: {
                    ArtistId: artist.get().id,
                    title: metadata.album
                  },
                  defaults: {
                    year: metadata.year !== "" ? metadata.year : 0
                  }
                }).spread(function(album){
                  audioFileMeta.setAlbum(album).then(function(){
                    callback(null);
                  });
                });
              });
          });
        }
      });
    }
  });
}