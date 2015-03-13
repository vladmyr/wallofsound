exports.getIndex = function (req, res){
    var model = new Model(req);
    model.title = "Home page 123";
    res.render("index", model);
};