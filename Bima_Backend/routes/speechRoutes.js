const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  transcribeAudio,
} = require("../controllers/speechController");

router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

module.exports = router;