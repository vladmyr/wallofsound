"use strict";

var fs = require("fs");
var path = require("path");
var services = require("../services");
var LibraryController = {};

LibraryController.initFormidable = function(formidable, options){
  LibraryController.formidable = formidable;
  LibraryController.formidableOptions = options;
}

LibraryController.postUpload = function(req, res){
  var form = new LibraryController.formidable.IncomingForm();
  form.multiples = true;

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
  var rstream = fs.createReadStream(file.path);
  services.FileManager.saveFileFromReadStream(path.join(__dirname, "../uploads", userId + ""), rstream, file.name, function(error){
    if(error){
      callback(error);
    }else{
      //delete temp file
      fs.unlink(file.path, function(error){
        callback(error);
      });
    }
  });
}