const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const getIndex = () => {
  return pinecone.index(process.env.PINECONE_INDEX_NAME);
};

const upsertVectors = async (vectors) => {
  if (!vectors || vectors.length === 0) {
    return;
  }

  const index = getIndex();

  await index.upsert({
    records: vectors,
  });

  console.log(`Upserted ${vectors.length} vectors to Pinecone`);
};

const searchVectors = async (queryEmbedding, topK = 5) => {
  const index = getIndex();

  const result = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return result.matches || [];
};

module.exports = {
  upsertVectors,
  searchVectors,
};