UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    isLocked: { type: Boolean, required: true },
    userRole: { type: Number, required: true }
});
UserSchema.methods.hashPassword = function(password, callback){
    bcrypt.genSalt(5, function(error, salt){
        if(error) return callback(error);
        bcrypt.hash(password, salt, null, function(error, hash){
            if(error) return callback(error);
            callback(err, hash);
        });
    });
}
UserSchema.methods.verifyPassword = function(userSchemaPassword, password, callback){
    bcrypt.compare(password, userSchemaPassword, function(error, isMatch){
        if(error) return callback(error);
        callback(null, isMatch);
    });

}
UserSchema.methods.toUser = function(userSchema){
    return new User(userSchema._id, userSchema.email, userSchema.isBlocked, userSchema.isLocked, userSchema.userRole);
}
UserSchema.pre("save", function(callback){
    var userSchema = this;
    if(!userSchema.isModified("password")) return callback();

    this.hashPassword(userSchema.password, function(error, hash) {
        if (!error) userSchema.password = hash;
        callback();
    });
});

UserModel = mongoose.model("user", UserSchema);

//ToDo: add validation
UserModel.schema.path("password").validate(function(value){
//    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value);
    return true;
}, "Password is not valid");

module.exports = UserModel;