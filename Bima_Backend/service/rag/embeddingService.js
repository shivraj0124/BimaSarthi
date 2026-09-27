const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434";

const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required for embedding");
  }

  try {
    const response = await axios.post(`${OLLAMA_URL}/api/embed`, {
      model: "bge-m3",
      input: text,
    });

    return response.data.embeddings[0];
  } catch (error) {
    console.error(
      "Embedding Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to generate embedding");
  }
};

module.exports = {
  generateEmbedding,
};