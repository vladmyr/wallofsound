DatabaseInitializer = (function(){
    return{
        seed: function(){
            var user = new User();
            user.setEmail("awelual@ukr.net");
            user.setPassword("1111");
            user.setBlocked(false);
            user.setLocked(false);
            user.setUserRole(UserRoles.SURERUSER);
            UserRepository.save(user, function(error){
                console.log(error);
            });

            user.setEmail("awelual@gmail.com");
            UserRepository.save(user);

            user.setEmail("khytsky.vladimir@gmail.com");
            UserRepository.save(user);

            UserRepository.findAll(function(err, users){
                console.log("FIRST USER", users[0]);
                var update = UserSchema.methods.toUser(users[0]);
                UserSchema.methods.hashPassword("22222", function(error, hash){
                    update.setPassword(hash);
                    console.log("UPDATE", update.toString());
                    UserRepository.update(update, function(error, userSchema){
                        console.log(error, userSchema);
                    });
                });
            });
            //console.log("Collection \"user\" exists? ", UserRepository.exists());
        }
    }
})();