DatabaseInitializer = (function(){
    return{
        seed: function(){
            var user = new User("awelual@ukr.net", "1111", false, false, UserRoles.SURERUSER);
            UserRepository.save(user);

            user.email = "awelual@gmail.com";
            UserRepository.save(user);

            user.email = "khytsky.vladimir@gmail.com";
            UserRepository.save(user);

            //UserRepository.findAll(function(err, users){
            //    console.log("FIRST USER", users[0]);
            //    var update = UserSchema.methods.toUser(users[0]);
            //    UserSchema.methods.hashPassword("22222", function(error, hash){
            //        update.setPassword(hash);
            //        console.log("UPDATE", update.toString());
            //        UserRepository.update(update, function(error, userSchema){
            //            console.log(error, userSchema);
            //        });
            //    });
            //});
            //console.log("Collection \"user\" exists? ", UserRepository.exists());
        }
    }
})();