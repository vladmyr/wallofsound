//FileManager = require("./middleware/FileManager");
var path = require("path");

exports.getUploadFile = function (req, res) {
    res.send(200);
}

//ToDo: refactor this function
exports.postUploadFile = function (req, res) {
    if (req.busboy) {

        req.busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
            //file was not attached
            if(filename === ""){
                res.status(400).send("File was not found");
            }else if(_.contains(["audio/mp3", "audio/mpeg"], mimetype)){
                //extract file matadata
                MusicMetadata(file, function(err, metadata){
                    var audioFile = new AudioFile();
                    metadata.artist.length > 0 && (audioFile.artist = metadata.artist[0]); //ToDo: extract all artists
                    metadata.title !== "" && (audioFile.title = metadata.title);
                    metadata.album !== "" && (audioFile.album = metadata.album);
                    metadata.year !== "" && (audioFile.year = +metadata.year);
                    metadata.track !== {} && typeof metadata.track.no !== "undefined" && (audioFile.trackNo = metadata.track.no);
                    //save *.mp3 in fs
                    var audioFilePath = path.join(PATH_PROJECT_DIR, AppConfig.PATH_FILE_UPLOAD_TMP);
                    FileManager.saveFile(audioFilePath, file, filename, function(error){
                        if(error){
                            res.status(500).send(error.message);
                        }else{
                            audioFile.userId = 0;
                            audioFile.path = path.join(audioFilePath, filename);
                            AudioFileRepository.save(audioFile, function(error){
                                if(error){
                                    res.status(500).send(error.message);
                                }else{
                                    res.sendStatus(200);
                                }
                            });
                        }
                    });
                });
            }else{
                /* Very strange behavior. According to comments from multipart.js:
                 "As of node@2efe4ab761666 (v0.10.29+/v0.11.14+), busboy had become
                 broken. Streams2/streams3 is a huge black box of confusion, but
                 somehow overriding the sync state seems to fix things again (and still
                 seems to work for previous node versions)."
                 In my case defining event handler solves the problem with closing connection on response.
                 ToDo: Further testing and digging are required.
                 */
                file.on('data', function() {});
                file.on('end', function() {
                    console.log("[File] " + filename + " upload finished");
                    //file type is not supported
                    res.status(400).send("Only *.mp3 files are acceptable");
                });
            }
        });
    }else{
        res.redirect(UrlMapping.LIBRARY + UrlMapping.LIBRARY_FILE_UPLOAD);
    }
}
exports.postDelFile = function(req, res) {
    res.send(200);
}