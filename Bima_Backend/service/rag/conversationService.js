const Chat = require("../../models/Chat");

/**
 * Get the insurance context from the current conversation.
 *
 * We look backward through the current session and find
 * the most recent message that has an insuranceId.
 */
const getConversationInsurance = async (
  userId,
  sessionId
) => {
  if (!userId || !sessionId) {
    return null;
  }

  const previousMessage = await Chat.findOne({
    userId,
    sessionId,
    insuranceId: { $ne: null },
  })
    .sort({ createdAt: -1 })
    .populate("insuranceId")
    .lean();

  if (!previousMessage) {
    return null;
  }

  return previousMessage.insuranceId;
};


/**
 * Save a user message.
 */
const saveUserMessage = async ({
  userId,
  sessionId,
  message,
  insuranceId = null,
  language = "en",
}) => {
  return Chat.create({
    userId,
    sessionId,
    role: "USER",
    message,
    insuranceId,
    language,
    isInsuranceRelated: !!insuranceId,
  });
};


/**
 * Save an assistant response.
 */
// const saveAssistantMessage = async ({
//   userId,
//   sessionId,
//   message,
//   insuranceId = null,
//   language = "en",
// }) => {
//   return Chat.create({
//     userId,
//     sessionId,
//     role: "ASSISTANT",
//     message,
//     insuranceId,
//     language,
//     isInsuranceRelated: !!insuranceId,
//   });
// };

// token usage added
const saveAssistantMessage = async ({
  userId,
  sessionId,
  message,
  insuranceId = null,
  language = "en",
  usage = {},
}) => {
  return Chat.create({
    userId,
    sessionId,
    role: "ASSISTANT",
    message,
    insuranceId,
    language,

    usage: {
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
      reasoningTokens: usage.completion_tokens_details?.reasoning_tokens || 0,
      totalTokens: usage.total_tokens || 0,
    },

    isInsuranceRelated: !!insuranceId,
  });
};

const getRecentMessages = async ({
  userId,
  sessionId,
  limit = 10,
}) => {
  const messages = await Chat.find({
    userId,
    sessionId,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  // Return chronological order
  return messages.reverse();
};


module.exports = {
  getConversationInsurance,
  saveUserMessage,
  saveAssistantMessage,
  getRecentMessages,
};