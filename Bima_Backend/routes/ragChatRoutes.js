const express = require("express");

const {
  ragChat,
} = require("../controllers/ragChatController");

const router = express.Router();

router.post("/", ragChat);

module.exports = router;