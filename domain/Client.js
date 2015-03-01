Client = (function(){
    var name;
    var id;
    var secret;
    var userId;

    return {
        getName: function(){
            return name;
        },
        setName: function(n){
            name = n;
        },
        getId: function(){
            return id;
        },
        setId: function(i){
            id = i;
        },
        getSecret: function(){
            return secret;
        },
        setSecret: function(s){
            secret = s;
        },
        getUserId: function(){
            return userId;
        },
        setUserId: function(i){
            userId = i;
        }
    }
})