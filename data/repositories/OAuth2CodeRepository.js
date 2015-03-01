OAuth2CodeRepository = (function(){
    "use strict"
    return {
        findAll: function(callback){
            OAuth2CodeModel.find(callback);
        },
        findOneByValue: function(value, callback){
            OAuth2CodeModel.findOne({ value: value }, callback);
        },
        save: function(code, callback){
            new OAuth2CodeSchema({
                value: code.getValue(),
                clientId: code.getClientId(),
                redirectUri: code.getRedirectUri(),
                userId: code.getUserId()
            }).save(function(error){
                    if(error){
                        return callback(error);
                    }else{
                        return callback(null, code.getValue);
                    }
                });

        },
        update: function(user, callback){

        },
        remove: function(id, callback){
            OAuth2CodeModel.findByIdAndRemove(id, callback);
        }
    }
})();