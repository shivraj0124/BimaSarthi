const Chat = require("../models/Chat");

exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chats = await Chat.find({ sessionId })
      .sort({ createdAt: 1 })
      .populate("insuranceId", "name.en");

    return res.json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Chat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $group: {
          _id: "$sessionId",

          lastMessage: {
            $first: "$message",
          },

          updatedAt: {
            $first: "$createdAt",
          },

          language: {
            $first: "$language",
          },

          insuranceId: {
            $first: "$insuranceId",
          },
        },
      },

      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    return res.json({
      success: true,
      data: sessions,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


exports.deleteSession = async (req, res) => {

  try {

    const { sessionId } = req.params;

    await Chat.deleteMany({
      sessionId,
    });

    return res.json({
      success: true,
      message: "Session deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.renameSession = async (req, res) => {

  try {

    const { sessionId } = req.params;
    const { title } = req.body;

    await Chat.updateMany(
      { sessionId },
      {
        sessionTitle: title,
      }
    );

    return res.json({
      success: true,
      message: "Session renamed successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};