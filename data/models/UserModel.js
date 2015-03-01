UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    isLocked: { type: Boolean, required: true },
    userRole: { type: Number, required: true }
});
UserSchema.methods.hashPassword = function(password, callback){
    bcrypt.genSalt(5, function(err, salt){
        if(err) return callback(err);
        bcrypt.hash(password, salt, null, function(err, hash){
            if(err) return callback(err);
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
    var user = new User();
    user.setId(userSchema._id);
    user.setEmail(userSchema.email);
    user.setBlocked(userSchema.isBlocked);
    user.setLocked(userSchema.isLocked);
    user.setUserRole(userSchema.userRole);
    return user;
}
UserSchema.pre("save", function(callback){
    var userSchema = this;
    if(!userSchema.isModified("password")) return callback();

    this.hashPassword(userSchema.password, function(error, hash){
        if(!error) userSchema.password = hash;
        callback();
    })
});
//UserSchema.pre("update", function(callback){
//    var userSchema = this;
//    if(!userSchema.isModified("password")) return callback();
//
//    this.hashPassword(userSchema.password, function(error, hash){
//        if(!error) userSchema.password = hash;
//        callback();
//    })
//});

UserModel = mongoose.model("user", UserSchema);
UserModel.schema.path("password").validate(function(value){
//    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value);
    return true;
}, "Password is not valid");

module.exports = UserModel;