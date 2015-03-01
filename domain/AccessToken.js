AccessToken = (function(){
    var id;
    var value;
    var userId;
    var clientId;

    return{
        getId: function(){
            return id;
        },
        setId: function(i){
            id = i;
        },
        getValue: function(){
            return value;
        },
        setValue: function(v){
            value = v;
        },
        getUserId: function(){
            return userId;
        },
        setUserId: function(i){
            userId = i;
        },
        getClientId: function(){
            return clientId;
        },
        setClientId: function(i){
            clientId = i;
        }
    }
});