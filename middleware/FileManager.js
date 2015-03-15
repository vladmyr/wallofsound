module.exports.createUploadDir = function(dir, callback){
    fs.exists(dir, function(exists){
        if(exists){
            return callback(null);
        }else{
            fs.mkdir(dir, function(error){
                if(error){
                    console.log("[Error] FileManager.createUploadDir(String): " + error.message);
                    return callback(error);
                }else{
                    return callback(null);
                }
            });
        }
    });
}

module.exports.saveFile = function(dir, file, filename, callback){
    //callback = typeof callback === "function"? callback : function(){};
    this.createUploadDir(dir, function(error){
        if(error){
            console.log("[Error] FileManager.saveFile(String, FileStream, String, Function): " + error.message);
            return callback(error);
        }else{
            var fstream = fs.createWriteStream(path.join(dir, filename));
            file.pipe(fstream);
            fstream.on("error", function(error){
                return callback(error);
            });
            fstream.on("close", function(){
                return callback(null);
            });
        }
    })
}

module.exports.rmFile = function(path, callback){

}