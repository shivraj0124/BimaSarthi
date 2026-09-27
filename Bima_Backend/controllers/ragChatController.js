const {
  generateRagAnswer,
} = require("../service/rag/ragChatService");

const ragChat = async (req, res) => {
  try {
    const {
      sessionId,
      message,
      language = "en",
      userId: bodyUserId,
    } = req.body;
    console.log(message, "message");

    const userId =
      req.user?.id ||
      req.user?._id ||
      bodyUserId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!["en", "hi", "mr"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
      });
    }

    const result = await generateRagAnswer({
      userId,
      sessionId,
      question: message.trim(),
      language,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("RAG Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process your question",
    });
  }
};

module.exports = {
  ragChat,
};