const express = require("express");
const router = express.Router();
const {
  sendMessage,
  likeMessage,
  getMessagesByGroup,
} = require("../controllers/message");
const { verifyUser } = require("../middlewares/auth");

router.post("/", verifyUser, sendMessage);
router.post("/like", verifyUser, likeMessage);
router.get("/:groupId", verifyUser, getMessagesByGroup);

module.exports = router;
