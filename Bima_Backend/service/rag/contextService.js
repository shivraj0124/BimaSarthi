const buildRagContext = ({
  question,
  insurance = null,
  retrievedChunks = [],
  recentMessages = [],
}) => {
  const sections = [];

  // Current insurance context
  if (insurance) {
    const insuranceName =
      insurance.name?.en ||
      insurance.name ||
      "Unknown insurance";

    sections.push(
      `CURRENT INSURANCE:\n${insuranceName}`
    );
  }

  // Conversation history
  if (recentMessages.length > 0) {
    const conversation = recentMessages
      .map(
        (message) =>
          `${message.role}: ${message.message}`
      )
      .join("\n");

    sections.push(
      `RECENT CONVERSATION:\n${conversation}`
    );
  }

  // Retrieved knowledge
  if (retrievedChunks.length > 0) {
    const knowledge = retrievedChunks
      .map((chunk, index) => {
        return [
          `[Source ${index + 1}]`,
          `Insurance: ${chunk.insuranceName || ""}`,
          `Section: ${chunk.section || ""}`,
          `Language: ${chunk.language || ""}`,
          `Content: ${chunk.text || ""}`,
        ].join("\n");
      })
      .join("\n\n");

    sections.push(
      `RETRIEVED INSURANCE KNOWLEDGE:\n${knowledge}`
    );
  }

  sections.push(
    `USER QUESTION:\n${question}`
  );

  return sections.join("\n\n====================\n\n");
};

module.exports = {
  buildRagContext,
};