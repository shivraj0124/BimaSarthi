const {
  generateEmbedding,
} = require("./embeddingService");

const {
  searchVectors,
} = require("./pineconeService");


const retrieveRelevantChunks = async (
  query,
  options = {}
) => {
  const {
    topK = 5,
    insuranceId = null,
    language = null,
  } = options;

  if (!query || !query.trim()) {
    throw new Error("Query is required");
  }

  // 1. Convert user question into embedding
  const queryEmbedding =
    await generateEmbedding(query);

  // 2. Search Pinecone
  let matches = await searchVectors(
    queryEmbedding,
    topK
  );

  // 3. Optional filtering
  if (insuranceId) {
    matches = matches.filter(
      (match) =>
        match.metadata?.insuranceId === insuranceId
    );
  }

  // Prefer the requested language when available,
  // but don't completely discard other languages.
  if (language) {
    const sameLanguage = matches.filter(
      (match) =>
        match.metadata?.language === language
    );

    if (sameLanguage.length > 0) {
      matches = sameLanguage;
    }
  }

  return matches.map((match) => ({
    id: match.id,
    score: match.score,
    insuranceId:
      match.metadata?.insuranceId,
    insuranceName:
      match.metadata?.insuranceName,
    language:
      match.metadata?.language,
    section:
      match.metadata?.section,
    text:
      match.metadata?.text,
  }));
};


module.exports = {
  retrieveRelevantChunks,
};