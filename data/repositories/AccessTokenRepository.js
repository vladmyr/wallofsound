AccessTokenRepository = (function(){
    "use strict"
    return {
        findAll: function(callback){
            AccessTokenModel.find(callback);
        },
        findOneByValue: function(value, callback){
            AccessTokenModel.findOne({ value: value }, callback);
        },
        save: function(token, callback){
            new AccessTokenModel({
                _id: mongoose.Types.ObjectId,
                value: token.getValue(),
                userId: token.getUserId(),
                clientId: token.getClientId()
            }).save(callback);
        },
        update: function(user, callback){

        },
        remove: function(id, callback){
            AccessTokenModel.findByIdAndRemove(id, callback);
        }
    }
})();