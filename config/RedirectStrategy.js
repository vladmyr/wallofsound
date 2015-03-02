exports = function (req, res) {
    res.render("index", {
        isAuthenticated: req.isAuthenticated()
    });
};