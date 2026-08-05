const fs = require("fs");
const { speechToText } = require("../service/sarvamService");

exports.transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required.",
      });
    }

    const languageMap = {
      en: "en-IN",
      hi: "hi-IN",
      mr: "mr-IN",
    };

    const languageCode =
      languageMap[req.body.language] || "en-IN";
      const transcript = await speechToText(
      req.file.path,
      languageCode
    );
   
    console.log("file path",req.file.path)

    // Delete temporary file
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Unable to delete temp file:", err);
      }
    });

    return res.status(200).json({
      success: true,
      transcript,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Speech recognition failed.",
      error: error.message,
    });
  }
};