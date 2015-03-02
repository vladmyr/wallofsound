//in order to save some traffic return only unique user id
passport.serializeUser(function (user, callback) {
    callback(null, user.id);
});

//deserialize by quering a user from database by id
passport.deserializeUser(function (id, callback) {
    UserRepository.findOneById(id, function (error, userSchema) {
        if (error) {
            return callback(error);
        } else if (!userSchema) {
            return callback(null, false);
        } else {
            return callback(null, UserSchema.methods.toUser(userSchema));
        }
    });
});

/* 
 * strategies 
 */
//local authorization using session and cookies
passport.use("local", new passportLocal.Strategy(function (email, password, callback) {
    UserRepository.findOneByEmail(email, function (error, userSchema) {
        if (!userSchema) {
            return callback(null, false);
        } else {
            UserSchema.methods.verifyPassword(userSchema.password, password, function (error, isMatch) {
                if (error) {
                    return callback(error);
                } else if (!isMatch) {
                    return callback(null, false);
                } else {
                    return callback(null, UserSchema.methods.toUser(userSchema));
                }
            });
        }
    });
}));

//http authorization for web services
passport.use("http", new passportHttp.BasicStrategy(function(email, password, callback){
    UserRepository.findOneByEmail(email, function(error, userSchema){
        if(!userSchema){
            return callback(null, false);
        }else{
            UserSchema.methods.verifyPassword(userSchema.password, password, function(error, isMatch){
                if(error) {
                    return callback(error);
                }else if(!isMatch){
                    return callback(null, false);
                }else{
                    return callback(null, UserSchema.methods.toUser(userSchema));
                }
            });
        }
    });
}));

passport.use("client-basic", new passportHttp.BasicStrategy(function(name, secret, callback){
    ClientRepository.findOneByName(name, function(error, clientSchema){
        if(error){
            return callback(error);
        }else if(!clientSchema || clientSchema.secret !== secret){
            return callback(null, false);
        }else {
            return callback(null, ClientSchema.methods.toClient(clientSchema));
        }
    });
}));

passport.use("bearer", new BearerStrategy(function(accessToken, callback){
    AccessTokenRepository.findOneByValue(accessToken, function(error, accessTokenSchema){
        if(error){
            return callback(error);
        }else if(!accessTokenSchema){
            return callback(error)
        }else{
            UserRepository.findOneById(accessTokenSchema.userId, function(error, userSchema){
                if(error){
                    return callback(error);
                }else if(!userSchema){
                    return callback(null, false);
                }else{
                    return callback(null, UserSchema.methods.toUser(userSchema), { scope: "*" });
                }
            });
        }
    });
}));

exports.isLocalAuthenticated = passport.authenticate("local", {
    //successRedirect: UrlMapping.INDEX[0],
    failureRedirect: UrlMapping.SIGN_IN,
    failureFlash: true
});
//exports.isHttpAuthenticated = passport.authenticate("http", { session: false });
//exports.isClientAuthenticated = passport.authenticate("client-basic", { session: false });
//exports.isBearerAuthenticated = passport.authenticate("bearer", { session: false });

exports.getSignIn = function(req, res){
    res.render("auth/login", { title: "Welcome back!" });
}
exports.getSignUp = function(req, res){
    res.render("auth/join", { title: "Join WallOfSound" });
}
exports.postSignUp = function(req, res){
    var user = new User(req.body.email, req.body.password, false, false, UserRoles.USER);
    UserRepository.save(user);
    res.send(200);
}
exports.postSignIn = function (req, res) {
    res.render("index", {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
}
exports.getSignOut = function(req, res) {
    req.logout();
    res.redirect("/");
}