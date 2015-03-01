OAuth2Code = (function(){
    var value;
    var redirectUri;
    var userId;
    var clientId;

    return {
        getValue: function(){
            return value;
        },
        setValue: function(v){
            value = v;
        },
        getRedirectUri: function(){
            return redirectUri;
        },
        setRedirectUri: function(r){
            redirectUri = r;
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