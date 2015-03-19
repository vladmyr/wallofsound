var FileUploadConfig = Object.freeze({
  audio: {
    uploadDir: "/uploads/tmp",
    maxFileSize: 1024 * 1024 * 48,
    accessControl: {
      allowOrigin: "*",
      allowMethods: "OPTIONS, HEAD, GET, POST, PUT, DELETE",
      allowHeaders: "Content-Type, Content-Range, Content-Disposition"
    },
    storage: {
      type: "local"
    }
  }
});

module.exports = FileUploadConfig;