const express = require("express");
const router = express.Router();
const { chatWithAgent } = require("../controllers/AgentController");

router.post("/chat", chatWithAgent);

module.exports = router;
