"use strict";

var fs = require("fs");
var path = require("path");
var services = require("../services");
var models = require("../models");
var LibraryController = {};

LibraryController.initFormidable = function(formidable, options){
  LibraryController.formidable = formidable;
  LibraryController.formidableOptions = options;
  services.FileManager.createDir(options.tmpDir);

  //services.FileManager.createDir(path.join(options.tmpDir,"a","b","c","d"), function(){
  //  services.FileManager.rmdir(path.join(options.tmpDir, "/*"), function(error){
  //    console.log(error);
  //  });
  //});
}

LibraryController.setMusicMetadata = function(musicMetaData){
  LibraryController.musicMataData = musicMetaData;
}

LibraryController.getLibrary = function(req, res){
  if(req.isAuthenticated()){
    //services.Library.list(req.user.id, function(rows){
    //  res.send(JSON.stringify(rows));
    //});
    res.render("library/library", new services.Model(req));
  }else{
    res.send(403).send("You are not authenticated");
  }
}

LibraryController.postUpload = function(req, res){
  if(req.isAuthenticated()){
    var form = new LibraryController.formidable.IncomingForm();
    form.uploadDir = LibraryController.formidableOptions.tmpDir;
    form.multiples = false;

    form.parse(req, function(error, fields, files){
      //ToDo: add file validation
      proceedFile(req.user.id, files.file, function(error){
        if(error){
          res.status(500).send(error);
        }else{
          res.status(200).send();
        }
      });
    });
  }else{
    res.status(403).send("You are not authenticated");
  }
}

module.exports = LibraryController;

function proceedFile(userId, file, callback){
  var filename = path.basename(file.path) + path.extname(file.name);
  //obtain audiofile metadata
  LibraryController.musicMataData(fs.createReadStream(file.path), { duration: true }, function(error, metadata){
    if(error){
      fs.unlink(file.path, function(){
        callback(error);
      });
    }else{
      //save file
      var uploadDestination = path.join(LibraryController.formidableOptions.uploadParentDir, userId + "");
      services.FileManager.saveFileFromReadStream(uploadDestination, fs.createReadStream(file.path), filename, function(error){
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
            UserId: userId,
            title: metadata.title !== "" ? metadata.title : file.name,
            trackNo: metadata.track && metadata.track.no ? metadata.track.no : 0,
            duration: 0,
            filePath: path.join(uploadDestination, filename)
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