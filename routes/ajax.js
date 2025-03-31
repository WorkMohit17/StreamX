const express = require("express");
const middleware = require("../middleware/index");
const ajaxController = require("../controllers/ajax");

const router = express.Router();

router.get(
  "/current/channel/:id",
  middleware.isLogedIn,
  middleware.isChannelParticipant,
  ajaxController.getChannelParticipants
);

router.post(
  "/profile/img",
  middleware.isLogedIn,
  ajaxController.uploadMiddleware,
  ajaxController.uploadProfilePicture
);

module.exports = router;
