var Model = function(req){
  var model = {};

  if(req.isAuthenticated()){
    model.isAuthenticated = true;
    model.user = req.user;
  }else{
    model.isAuthenticated = false;
    model.user = null;
  }

  return model;
}

module.exports = Model;