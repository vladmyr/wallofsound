UserRepository = (function(){
    "use strict"
    return {
        findAll: function(callback){
            UserModel.find(callback);
        },
        findOneById: function(id, callback){
            UserModel.findOne({ _id: id }, callback);
        },
        findOneByEmail: function(email, callback){
            UserModel.findOne({ email: email }, callback);
        },
        save: function(user, callback){
//            var userId = mongoose.Types.ObjectId();
            new UserModel({
                _id: mongoose.Types.ObjectId(),
                email: user.getEmail(),
                password: user.getPassword(),
                isBlocked: user.getBlocked(),
                isLocked: user.getLocked(),
                userRole: user.getUserRole()
            }).save(callback);
        },
        update: function(user, callback){
            new UserModel.update({
                _id: user.getId()
            },{
                $set: {
                    email: user.getEmail(),
                    password: user.getPassword(),
                    isBlocked: user.getBlocked(),
                    isLocked: user.getLocked(),
                    userRole: user.getUserRole()
                }
            }, callback);
//            this.findById(function(error, user){
//                //ToDo add error handling
//                user.email = updatedUser.getEmail();
//                user.password = updatedUser.getPassword();
//                user.isBlocked = updatedUser.getBlocked();
//                user.isLocked = updatedUser.getLocked();
//                user.userRole = updatedUser.getUserRole();
//
//                this.save(function(error){
//
//                });
//            });
        },
        remove: function(id, callback){
            UserModel.findByIdAndRemove(id, callback);
        }
    }
})();