ClientSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, unique: true, required: true },
    secret: { type: String, required: true },
    userId: { type: String, required: true }
});
ClientSchema.methods.toClient = function(clientSchema){
    var client = new Client();
    client.setId(clientSchema._id);
    client.setName(clientSchema.name);
    client.setUserId(clientSchema.userId);
    client.setSecret(clientSchema.secret);
    return client;
}
ClientModel = mongoose.model("client", ClientSchema);