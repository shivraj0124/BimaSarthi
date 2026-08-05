const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Group messages into one conversation
    sessionId: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["USER", "ASSISTANT"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
      default: null,
    },

    language: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
    },

    // AI metadata
    intent: {
      type: String,
      default: null,
    },

    isInsuranceRelated: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);