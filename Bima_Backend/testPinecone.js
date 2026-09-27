require("dotenv").config();

const {
  generateEmbedding,
} = require("./service/rag/embeddingService");

const {
  upsertVectors,
  searchVectors,
} = require("./service/rag/pineconeService");

const test = async () => {
  try {
    const text =
      "आयुष्मान भारतसाठी कोणती कागदपत्रे आवश्यक आहेत?";

    console.log("Generating embedding...");

    const embedding = await generateEmbedding(text);

    console.log("Embedding dimensions:", embedding.length);

    const vector = {
      id: "test-ayushman-documents",
      values: embedding,
      metadata: {
        insuranceId: "test-insurance-1",
        insuranceName: "Ayushman Bharat",
        language: "mr",
        section: "documentsRequired",
        text: "आयुष्मान भारतासाठी आधार कार्ड आणि इतर आवश्यक कागदपत्रे आवश्यक आहेत.",
      },
    };

    console.log("Uploading vector...");

    await upsertVectors([vector]);

    console.log("Vector uploaded successfully!");

    console.log("Testing semantic search...");

    const searchQuery =
      "आयुष्मान भारतासाठी कोणते डॉक्युमेंट लागतात?";

    const queryEmbedding =
      await generateEmbedding(searchQuery);

    const results =
      await searchVectors(queryEmbedding, 3);

    console.log("\nSearch Results:");

    console.dir(results, { depth: null });

  } catch (error) {
    console.error("Test failed:", error);
  }
};

test();