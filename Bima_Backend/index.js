const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;
const authRoutes = require("./routes/Authentication");
const insuranceRoutes = require("./routes/Insurance");
const learnRoutes = require("./routes/Learn");
const agentRoutes = require("./routes/AgentRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const speechRoutes = require("./routes/speechRoutes");
const ragChatRoutes = require("./routes/ragChatRoutes");



// Middleware
app.use(express.json());
app.use(cors());
console.log("MONGODB_URI:", MONGODB_URI);
// MongoDB Connection (with try–catch)
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.warn("Continuing without DB connection for debugging (db not connected).");
  }
};

// Call DB connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/rag-chat", ragChatRoutes);
// Global error handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
