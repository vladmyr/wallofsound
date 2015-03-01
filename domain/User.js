User = (function(){
    var id;
    var email;
    var password;
    var isBlocked;
    var isLocked;
    var userRole;

    return {
        getId: function(){
            return id;
        },
        setId: function(i){
            id = i;
        },
        getEmail: function(){
            return email;
        },
        setEmail: function(e){
            email = e;
        },
        getPassword: function(){
            return password;
        },
        setPassword: function(p){
            password = p;
        },
        getBlocked: function(){
            return isBlocked;
        },
        setBlocked: function(bool){
            isBlocked = bool;
        },
        getLocked: function(){
            return isLocked;
        },
        setLocked: function(bool){
            isLocked = bool;
        },
        getUserRole: function(){
            return userRole;
        },
        setUserRole: function(r){
            userRole = r;
        },
        toString: function(){
            return "User { id: " + this.getId()
                + ", email: " + this.getEmail()
                + ", password: " + this.getPassword()
                + ", isBlocked: " + this.getBlocked()
                + ", isLocked: " + this.getLocked()
                + ", userRole: " + this.getUserRole()
                + " }";
        }
    }
});