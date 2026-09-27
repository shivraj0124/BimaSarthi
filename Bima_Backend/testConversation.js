require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/User");
const Chat = require("./models/Chat");

const {
  getConversationInsurance,
  getRecentMessages,
} = require("./service/rag/conversationService");

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

const test = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Get any existing user
    const user = await User.findOne().lean();

    if (!user) {
      console.log("No users found in database.");
      return;
    }

    console.log("Using user:", user._id.toString());

    // Find one existing conversation for this user
    const existingChat = await Chat.findOne({
      userId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!existingChat) {
      console.log("No chat history found for this user.");
      return;
    }

    const sessionId = existingChat.sessionId;

    console.log("Using session:", sessionId);

    // Test insurance memory
    const insurance =
      await getConversationInsurance(
        user._id,
        sessionId
      );

    console.log("\nConversation Insurance:");

    if (insurance) {
      console.log({
        id: insurance._id,
        name: insurance.name,
        type: insurance.type,
        category: insurance.category,
      });
    } else {
      console.log("No insurance context found.");
    }

    // Test recent messages
    const messages =
      await getRecentMessages({
        userId: user._id,
        sessionId,
        limit: 10,
      });

    console.log("\nRecent Messages:");

    messages.forEach((message) => {
      console.log({
        role: message.role,
        message: message.message,
        insuranceId: message.insuranceId,
        language: message.language,
      });
    });

  } catch (error) {
    console.error(
      "Conversation test failed:",
      error
    );
  } finally {
    await mongoose.disconnect();
  }
};

test();