const express = require("express");
const middleware = require("../middleware/index");
const channelController = require("../controllers/channelController");

const router = express.Router();

router.post(
    "/new",
    middleware.isLogedIn,
    channelController.uploadMiddleware,
    channelController.createChannel
);

router.get("/join/:id", channelController.getJoinChannel);

router.post("/join/:id", middleware.isLogedIn, channelController.postJoinChannel);

router.get("/:id", middleware.isLogedIn, middleware.isChannelParticipant, channelController.getChannelChat);

module.exports = router;
