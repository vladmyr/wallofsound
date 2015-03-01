OAuth2CodeSchema = new mongoose.Schema({
    value: { type: String, required: true },
    redirectUri: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true }
});

OAuth2CodeModel = mongoose.model("oauth2code", OAuth2CodeSchema);