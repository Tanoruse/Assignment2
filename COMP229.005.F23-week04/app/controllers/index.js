module.exports.home = function (req, res, next) {
    res.send("Welcome Home");
}

module.exports.prd = function (req, res, next) {
    res.send("Welcome Products");
}