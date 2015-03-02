DatabaseInitializer = (function(){
    return{
        seed: function(){
            var user = new User("khytsky.vladimir@gmail.com", "1111", false, false, UserRoles.SUPERUSER);
            UserRepository.save(user);
        }
    }
})();