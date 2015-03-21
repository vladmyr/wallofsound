"use strict";

var fs = require("fs-extra");
var path = require("path");

var FileManager = {};
FileManager.createDir = function(dir, callback){
  callback = (typeof callback === "function" ? callback : function(){});
  fs.exists(dir, function(isExist){
    if(isExist){
      callback(null);
    }else{
      mkdirParent(dir, callback);
    }
  });
}

FileManager.saveFileFromReadStream = function(dir, file, filename, callback){
  this.createDir(dir, function(error){
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

FileManager.rmdir = function(dir, callback){
  callback = (typeof callback === "function" ? callback : function(){});
  fs.remove(dir, callback);
}

module.exports = FileManager;

function mkdirParent(dir, callback){
  fs.mkdir(dir, function(error){
    if(error && error.errno === 34){
      mkdirParent(path.dirname(dir), function(){
        mkdirParent(dir, callback);
      });
    }else{
      callback(null);
    }
  });
}

