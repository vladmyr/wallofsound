//model object that contains all data that is to be rendered on view page
module.exports = function (req){
    var model = {};

    if (req.isAuthenticated()) {
        model.isAuthenticated = req.isAuthenticated();
        model.user = req.user;
    } else {
        model.isAuthenticated = false;
        model.user = null;
    }

    return model;
}