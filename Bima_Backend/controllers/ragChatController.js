const {
  generateRagAnswer,
} = require("../service/rag/ragChatService");

const mongoose = require("mongoose");
const Chat = require("../models/Chat");
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
    console.log("result", result);

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

const getUserTokenUsage = async (userId, startDate, endDate) => {
  const result = await Chat.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        role: "ASSISTANT",
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPromptTokens: {
          $sum: "$usage.promptTokens",
        },
        totalCompletionTokens: {
          $sum: "$usage.completionTokens",
        },
        totalReasoningTokens: {
          $sum: "$usage.reasoningTokens",
        },
        totalTokens: {
          $sum: "$usage.totalTokens",
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalReasoningTokens: 0,
      totalTokens: 0,
    }
  );
};
module.exports = {
  ragChat,
  getUserTokenUsage,
};