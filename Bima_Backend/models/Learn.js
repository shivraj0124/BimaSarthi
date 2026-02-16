const mongoose = require("mongoose");

const learnSchema = new mongoose.Schema(
  {
    // Type of content
    contentType: {
      type: String,
      enum: ["video", "image"],
      required: true
    },

    // Media URL
    mediaUrl: {
      type: String,
      required: true
    },

    thumbnailUrl: {
      type: String
    },

    // Multilingual Content (Directly inside)
    content: {
      en: {
        title: { type: String, required: true },
        description: { type: String, required: true }
      },
      hi: {
        title: { type: String, required: true },
        description: { type: String, required: true }
      },
      mr: {
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    },

    // Category
    category: {
      type: String,
      required: true
    },

    // Tags
    tags: [
      {
        type: String
      }
    ],

    // Duration (for videos)
    duration: {
      type: String
    },

    // Order for sorting
    order: {
      type: Number,
      default: 0
    },

    // Is Active
    isActive: {
      type: Boolean,
      default: true
    },

    // View count
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Learn", learnSchema);
