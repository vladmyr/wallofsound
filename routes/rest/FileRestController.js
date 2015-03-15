FileManager = require("./middleware/FileManager");

exports.getUploadFile = function (req, res) {
    res.send(200);
}
exports.postUploadFile = function (req, res) {
    if (req.busboy) {
        req.busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
            console.log("Uploading file...");
            //console.log(fieldname, file, filename);
            res.send(200);
        });
    }
}
exports.postDelFile = function(req, res) {
    res.send(200);
}