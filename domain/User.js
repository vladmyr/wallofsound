User = function(id, email, password, isBlocked, isLocked, userRole) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.isBlicked = isBlocked;
    this.isLocked = isLocked;
    this.userRole = userRole;
}
User.prototype.toString = function(){
    return "User { id: " + this.getId() 
                + ", email: " + this.getEmail() 
                + ", password: " + this.getPassword() 
                + ", isBlocked: " + this.getBlocked() 
                + ", isLocked: " + this.getLocked() 
                + ", userRole: " + this.getUserRole() 
                + " }";
}