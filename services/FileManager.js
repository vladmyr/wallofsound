"use strict";

var fs = require("fs");
var path = require("path");

var FileManager = {};
FileManager.createUploadDir = function(dir, callback){
  fs.exists(dir, function(isExist){
    if(isExist){
      callback(null);
    }else{
      fs.mkdir(dir, function(error){
        if(error){
          callback(error);
        }else{
          callback(null);
        }
      })
    }
  });
}
FileManager.saveFileFromReadStream = function(dir, file, filename, callback){
  this.createUploadDir(dir, function(error){
    if(error){
      callback(error);
    }else{
      //var rstream = fs.createReadStream();
      var fstream = fs.createWriteStream(path.join(dir, filename));
      file.pipe(fstream);
      fstream.on("error", function(error){
        callback(error);
      }).on("close", function(){
        callback(null);
      })
    }
  });
}
module.exports = FileManager;