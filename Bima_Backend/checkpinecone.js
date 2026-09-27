require("dotenv").config();

const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const check = async () => {
  try {
    const result = await pinecone.listIndexes();

    console.log("Pinecone indexes:");

    result.indexes?.forEach((index) => {
      console.log({
        name: index.name,
        dimension: index.dimension,
        metric: index.metric,
        status: index.status,
      });
    });
  } catch (error) {
    console.error("Pinecone Error:", error);
  }
};

check();