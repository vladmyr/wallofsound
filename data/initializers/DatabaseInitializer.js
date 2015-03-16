DatabaseInitializer = (function(){
    return{
        seed: function(){
            var user = new User(0, "khytsky.vladimir@gmail.com", "1111", false, false, UserRoles.SUPERUSER);
            UserRepository.save(user);
        }
    }
})();