AccessTokenSchema = new mongoose.Schema({
    value: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true }
});
AccessTokenModel = mongoose.model("AccessToken", AccessTokenSchema);