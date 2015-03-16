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
passport.use("local", new passportLocal.Strategy(verifyCredentials)); //local authorization using session and cookies
passport.use("http", new passportHttp.BasicStrategy(verifyCredentials)); //http authorization for web services

passport.use("client", new passportOAuth2ClientPassword.Strategy(function(id, secret, callback){
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

passport.use("bearer", new passportHttpBearer.Strategy(function(accessToken, callback){
    AccessTokenRepository.findOneByValue(accessToken, function(error, accessTokenSchema){
        if(error){
            return callback(error);
        }else if(!accessTokenSchema) {
            return callback(error);
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

//exports.isLocalAuthenticated = function(req, res, next){
//    passport.authenticate("local", function(error, user, info){
//        console.log(error, user, info, arguments);
//        if(!user){
//            req.flash("hasErrorMessage", true);
//            req.flash("errorMessage", "Invalid username and password");
//            res.redirect(UrlMapping.SIGN_IN);
//        }else{
//            next();
//        }
//    })(req, res, next);
//}

exports.isLocalAuthenticated = passport.authenticate("local", {
    failureRedirect: UrlMapping.SIGN_IN,
    failureFlash: true
});

exports.isHttpAuthenticated = passport.authenticate("http", { session: false });
//exports.isClientAuthenticated = passport.authenticate("client-basic", { session: false });
//exports.isBearerAuthenticated = passport.authenticate("bearer", { session: false });

exports.hasAuthority = function(req, res, next) {
    next();
}

exports.getSignIn = function(req, res){
    res.render("auth/login", { title: "Welcome back!" });
}
exports.getSignUp = function(req, res){
    res.render("auth/join", { title: "Join WallOfSound" });
}
exports.postSignUp = function(req, res){
    var user = new User(0, req.body.email, req.body.password, false, false, UserRoles.USER);
    UserRepository.save(user, function(error){
        if(error){
            res.status(500).send(error.message);
        }else{
            res.sendStatus(200);
        }
    });
}
exports.postSignIn = function (req, res) {
    res.redirect("/");
    //res.render("index", {
    //    isAuthenticated: req.isAuthenticated(),
    //    user: req.user
    //});
}
exports.getSignOut = function(req, res) {
    req.logout();
    res.redirect("/");
}

/*
 * internal functions
 */
function verifyCredentials(username, password, callback) {
    UserRepository.findOneByEmail(username, function (error, userSchema) {
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
}