const express = require("express");

const router = express.Router();

const {
    getChatHistory,
    getUserSessions,
    deleteSession,
    renameSession
} = require("../controllers/ChatController");

router.get("/history/:sessionId", getChatHistory);

router.get("/sessions/:userId", getUserSessions);

router.delete("/session/:sessionId", deleteSession);

router.patch("/session/:sessionId", renameSession);

module.exports = router;