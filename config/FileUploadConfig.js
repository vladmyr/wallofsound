var path = require("path");

var FileUploadConfig = Object.freeze({
  audio: {
    tmpDir: path.join(__dirname,"../uploads/tmp"),
    uploadParentDir: path.join(__dirname,"../uploads"),
    maxFileSize: 1024 * 1024 * 48
  }
});

module.exports = FileUploadConfig;