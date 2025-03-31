const User = require("../models/user");

exports.homeRedirect = async (req, res) => {
    if (req.user) {
        try {
            await User.findById(req.user._id);
            res.redirect("/users/@me");
        } catch (error) {
            console.log(error);
            res.redirect("/users/login");
        }
    } else {
        res.redirect("/users/login");
    }
};
