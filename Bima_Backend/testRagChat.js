require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const {
  generateRagAnswer,
} = require("./service/rag/ragChatService");

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

const test = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Get an existing user
    const user = await User.findOne();

    if (!user) {
      throw new Error("No user found in database");
    }

    console.log("User:", user._id.toString());

    // New test conversation
    const sessionId =
      `rag-test-${Date.now()}`;

    console.log("Session:", sessionId);

    // ==========================================
    // QUESTION 1
    // ==========================================

    console.log("\n==============================");
    console.log("QUESTION 1");
    console.log("==============================");

    const result1 =
      await generateRagAnswer({
        userId: user._id,
        sessionId,
        question:
          "आयुष्मान भारत म्हणजे काय?",
        language: "mr",
      });

    console.log("\nANSWER 1:");
    console.log(result1.answer);

    console.log(
      "\nInsurance ID:",
      result1.insuranceId
    );

    console.log(
      "Insurance:",
      result1.insurance
    );


    // ==========================================
    // QUESTION 2
    // ==========================================

    console.log("\n==============================");
    console.log("QUESTION 2");
    console.log("==============================");

    const result2 =
      await generateRagAnswer({
        userId: user._id,
        sessionId,
        question:
          "कोणती कागदपत्रे आवश्यक आहेत?",
        language: "mr",
      });

    console.log("\nANSWER 2:");
    console.log(result2.answer);

    console.log(
      "\nInsurance ID:",
      result2.insuranceId
    );

    console.log(
      "Insurance:",
      result2.insurance
    );


    console.log("\n==============================");
    console.log("RAG TEST COMPLETED");
    console.log("==============================");

  } catch (error) {
    console.error(
      "\nRAG TEST FAILED:"
    );

    console.error(error);

  } finally {
    await mongoose.disconnect();
  }
};

test();