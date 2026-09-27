const Insurance = require("../../models/Insurance");

const {
  retrieveRelevantChunks,
} = require("./retrievalService");

const {
  getConversationInsurance,
  getRecentMessages,
  saveUserMessage,
  saveAssistantMessage,
} = require("./conversationService");

const {
  buildRagContext,
} = require("./contextService");

const askGroq = require("../../service/groqService");


// --------------------------------------------------
// Build query for semantic search
// --------------------------------------------------

const buildSearchQuery = ({
  question,
  insurance,
}) => {
  if (!insurance) {
    return question;
  }

  const insuranceName =
    insurance.name?.en ||
    insurance.name?.hi ||
    insurance.name?.mr ||
    "Unknown insurance";

  return `
Insurance: ${insuranceName}

User question:
${question}
`.trim();
};


// --------------------------------------------------
// Find actual insurance from Pinecone result
// --------------------------------------------------

const getInsuranceFromRetrievedChunks = async (
  retrievedChunks
) => {
  if (
    !retrievedChunks ||
    retrievedChunks.length === 0
  ) {
    return null;
  }

  // First relevant Pinecone result
  const insuranceId =
    retrievedChunks[0]?.insuranceId;

  if (!insuranceId) {
    return null;
  }

  try {
    const insurance =
      await Insurance.findById(
        insuranceId
      ).lean();

    return insurance || null;

  } catch (error) {
    console.error(
      "Failed to fetch insurance from MongoDB:",
      error.message
    );

    return null;
  }
};


// --------------------------------------------------
// Main RAG Chat
// --------------------------------------------------

const generateRagAnswer = async ({
  userId,
  sessionId,
  question,
  language = "en",
}) => {

  // ================================================
  // 1. Get previous insurance from conversation
  // ================================================

  const previousInsurance =
    await getConversationInsurance(
      userId,
      sessionId
    );


  // ================================================
  // 2. Build search query
  // ================================================

  const searchQuery =
    buildSearchQuery({
      question,
      insurance: previousInsurance,
    });


  console.log("\n==============================");
  console.log("RAG SEARCH QUERY");
  console.log("==============================");
  console.log(searchQuery);


  // ================================================
  // 3. Retrieve from Pinecone
  // ================================================

  const retrievedChunks =
    await retrieveRelevantChunks(
      searchQuery,
      {
        topK: 5,
        language,

        // IMPORTANT:
        // Only apply insurance filter when we
        // already know the insurance from memory.
        insuranceId:
          previousInsurance?._id?.toString() ||
          null,
      }
    );


  console.log("\n==============================");
  console.log("RETRIEVED CHUNKS");
  console.log("==============================");

  retrievedChunks.forEach(
    (chunk, index) => {
      console.log(
        `\nResult ${index + 1}`
      );

      console.log(
        "Insurance:",
        chunk.insuranceName
      );

      console.log(
        "Section:",
        chunk.section
      );

      console.log(
        "Language:",
        chunk.language
      );

      console.log(
        "Score:",
        chunk.score
      );
    }
  );


  // ================================================
  // 4. Determine current insurance
  // ================================================

  let currentInsurance =
    previousInsurance;


  // If there was no previous insurance,
  // identify it from the retrieved Pinecone result.
  if (!currentInsurance) {

    currentInsurance =
      await getInsuranceFromRetrievedChunks(
        retrievedChunks
      );

  }


  console.log("\n==============================");
  console.log("CURRENT INSURANCE");
  console.log("==============================");

  if (currentInsurance) {
    console.log(
      currentInsurance.name?.en ||
      currentInsurance.name
    );

    console.log(
      "ID:",
      currentInsurance._id
    );
  } else {
    console.log(
      "No insurance identified"
    );
  }


  // ================================================
  // 5. Get recent conversation
  // ================================================

  const recentMessages =
    await getRecentMessages({
      userId,
      sessionId,
      limit: 10,
    });


  // ================================================
  // 6. Build context for Groq
  // ================================================

  const context =
    buildRagContext({
      question,
      insurance: currentInsurance,
      retrievedChunks,
      recentMessages,
    });


  console.log("\n==============================");
  console.log("RAG CONTEXT CREATED");
  console.log("==============================");


  // ================================================
  // 7. Save USER message
  // ================================================

  await saveUserMessage({
    userId,
    sessionId,
    message: question,

    insuranceId:
      currentInsurance?._id || null,

    language,
  });


  // ================================================
  // 8. Build Groq prompt
  // ================================================

  const prompt = `
You are BimaSarthi, a multilingual insurance assistant.

Your job is to answer the user's question using ONLY the
insurance information provided in the retrieved knowledge.

IMPORTANT RULES:

1. Do not invent facts.
2. Do not use information that is not present in the provided context.
3. If the required information is not available in the context,
   say that you do not have enough information.
4. Answer in the user's selected language.
5. Keep the answer simple and easy to understand.
6. Do not mention Pinecone, embeddings, vector databases,
   RAG, retrieval, or internal system architecture.
7. Do not make assumptions about insurance policies.
8. If the question is a follow-up question, use the current
   insurance and conversation context.
9. Use the retrieved insurance knowledge as the primary source.

Language:
${language}

CONTEXT:

${context}

Now answer the user's question.
`.trim();


  // ================================================
  // 9. Generate answer using Groq
  // ================================================

  const answer =
    await askGroq(prompt);


  // ================================================
  // 10. Save ASSISTANT message
  // ================================================

  await saveAssistantMessage({
    userId,
    sessionId,
    message: answer,

    insuranceId:
      currentInsurance?._id || null,

    language,
  });


  // ================================================
  // 11. Return response
  // ================================================

  return {
  sessionId,

  answer,

  insuranceId:
    currentInsurance?._id || null,

  insurance:
    currentInsurance?.name || null,

  sources: retrievedChunks.map(
    (chunk) => ({
      insuranceName: chunk.insuranceName,
      section: chunk.section,
      language: chunk.language,
      score: chunk.score,
    })
  ),
};
};


module.exports = {
  generateRagAnswer,
};