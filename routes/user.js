const express = require("express");
const passport = require("passport");
const middleware = require("../middleware/index");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/login", userController.renderLoginPage);
router.post("/login", passport.authenticate("local-login", { failureRedirect: "/users/register" }), userController.loginUser);

router.get("/register", userController.renderRegisterPage);
router.post("/register", passport.authenticate("local-signup", { failureRedirect: "/users/register", failureFlash: true }), userController.registerUser);

router.get("/logout", middleware.isLogedIn, userController.logoutUser);

router.get("/@me", middleware.isLogedIn, userController.getUserProfile);
router.get("/:id", middleware.isLogedIn, userController.getExternalUserProfile);
router.patch("/@me/update", middleware.isLogedIn, userController.updateUserProfile);

module.exports = router;
