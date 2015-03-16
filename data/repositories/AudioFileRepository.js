AudioFileRepository = (function(){
    "use strict"
    return {
        findAll: function(callback){
            AudioFileModel.find(callback);
        },
        findOneById: function(id, callback){
            UserModel.findOne({ _id: id }, callback);
        },
        save: function(audioFile, callback){
            new AudioFileModel({
                _id: mongoose.Types.ObjectId(),
                userId: mongoose.Types.ObjectId(),
                artist: audioFile.artist,
                title: audioFile.title,
                album: audioFile.album,
                year: audioFile.year,
                trackNo: audioFile.trackNo,
                path: audioFile.path
            }).save(callback);
        },
        update: function(audioFile, callback){
            new AudioFileModel.update({
                _id: audioFile.id
            },{
                $set: {
                    userId: audioFile.userId,
                    artist: audioFile.artist,
                    title: audioFile.title,
                    album: audioFile.album,
                    year: audioFile.year,
                    trackNo: audioFile.trackNo,
                    path: audioFile.path
                }
            }, callback);
        },
        remove: function(id, callback){
            AudioFileModel.findByIdAndRemove(id, callback);
        }
    }
})();