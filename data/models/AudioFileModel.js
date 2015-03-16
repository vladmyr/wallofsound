AudioFileSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    userId: { type: mongoose.Schema.ObjectId, required: true },
    artist: { type: String },
    title: { type: String },
    album: { type: String },
    year: { type: Number },
    trackNo: { type: Number },
    path: { type: String, required: true, unique: true }
});
AudioFileSchema.methods.toAudioFile = function(schema){
    var audioFile = new AudioFile();
    audioFile.id = schema._id;
    audioFile.userId = schema.userId;
    audioFile.artist = schema.artist;
    audioFile.title = schema.title;
    audioFile.album = schema.album;
    audioFile.year = schema.year;
    audioFile.trackNo = schema.trackNo;
    audioFile.path = schema.path;
    return audioFile;
}

AudioFileModel = mongoose.model("audioFile", AudioFileSchema);