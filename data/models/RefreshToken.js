RefreshTokenSchema = new mongoose.Schema({
    value: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true },
    created: { type: Date, default: Date.now }
});
RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);