const passport = require("passport");
const { ObjectID } = require("mongodb");
const User = require("../models/user");

exports.renderLoginPage = (req, res) => {
    res.render("login", { title: "Login" });
};

exports.loginUser = (req, res) => {
    User.findById(req.user._id).then((rUser) => {
        rUser.online = true;
        rUser.save();
    });
    res.redirect("/users/@me");
};

exports.renderRegisterPage = (req, res) => {
    res.render("register", { title: "Register" });
};

exports.registerUser = (req, res) => {
    User.findById(req.user._id).then((rUser) => {
        rUser.online = true;
        rUser.save();
    });
    res.redirect("/users/@me");
};

exports.logoutUser = (req, res) => {
    User.findById(req.user._id).then((rUser) => {
        rUser.online = false;
        rUser.save();
    });
    req.logout();
    res.redirect("/");
};

exports.getUserProfile = (req, res) => {
    User.findById(req.user._id)
        .populate("channels")
        .then((rUser) => {
            res.render("profile", { channels: rUser.channels, title: "username" });
        })
        .catch((e) => res.send(e));
};

exports.getExternalUserProfile = (req, res) => {
    User.findById(req.user._id)
        .populate("channels")
        .then((currentUser) => {
            User.findById(req.params.id)
                .populate("channels")
                .then((rUser) => {
                    if (ObjectID(req.params.id).equals(ObjectID(req.user._id))) {
                        return res.redirect("@me");
                    }
                    res.render("external_profile", {
                        currentUserChannels: currentUser.channels,
                        channels: rUser.channels,
                        title: "username",
                        user: rUser,
                    });
                })
                .catch((e) => res.send(e));
        });
};

exports.updateUserProfile = (req, res) => {
    User.findByIdAndUpdate(req.user._id, req.body.user)
        .then(() => res.redirect("/users/@me"))
        .catch((e) => {
            console.log(e);
            res.redirect("/user/@me");
        });
};
