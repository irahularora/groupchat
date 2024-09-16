const express = require('express');
const router = express.Router();
const { sendMessage, likeMessage } = require('../controllers/message');
const { verifyUser } = require("../middlewares/auth");

router.post('/messages', verifyUser, sendMessage);
router.post('/messages/like', verifyUser, likeMessage);

module.exports = router;
