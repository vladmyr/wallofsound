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
            new UserModel({
                _id: mongoose.Types.ObjectId(),
                email: user.email,
                password: user.password,
                isBlocked: user.blocked,
                isLocked: user.locked,
                userRole: user.userRole
            }).save(callback);
        },
        update: function(user, callback){
            new UserModel.update({
                _id: user.id
            },{
                $set: {
                    email: user.email,
                    password: user.password,
                    isBlocked: user.isBlocked,
                    isLocked: user.isLocked,
                    userRole: user.userRole
                }
            }, callback);
        },
        remove: function(id, callback){
            UserModel.findByIdAndRemove(id, callback);
        }
    }
})();