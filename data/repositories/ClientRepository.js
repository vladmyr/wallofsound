ClientRepository = (function(){
    return {
        findAll: function(callback){
            ClientModel.find(callback);
        },
        findOneById: function(id, callback){
            ClientModel.findOne({ _id: id }, callback);
        },
        findOneByName: function(name, callback){
            ClientModel.findOne({ name: name }, callback);
        },
        findOneByUserId: function(id, callback){
            ClientModel.findOne({ userId: id}, callback);
        },
        findByUserId: function(id, callback){
            ClientModel.find({ userId: id }, callback);
        },
        save: function(client, callback){
            new ClientModel({
                _id: mongoose.Types.ObjectId(),
                name: client.getName(),
                userId: client.getUserId(),
                secret: client.getSecret()
            }).save(callback);
        },
        update: function(user, callback){

        },
        remove: function(id, callback){
            ClientModel.findByIdAndRemove(id, callback);
        }
    }
})();