require("dotenv").config();

const {
  retrieveRelevantChunks,
} = require("./service/rag/retrievalService");


const test = async () => {
  try {
    const query =
      "आयुष्मान भारतसाठी कोणती कागदपत्रे आवश्यक आहेत?";

    console.log("Query:");
    console.log(query);

    console.log("\nSearching Pinecone...\n");

    const results =
      await retrieveRelevantChunks(query, {
        topK: 5,
        language: "mr",
      });

    console.log("Retrieved Chunks:\n");

    results.forEach((result, index) => {
      console.log(`--- Result ${index + 1} ---`);

      console.log("Score:", result.score);
      console.log("Insurance:", result.insuranceName);
      console.log("Language:", result.language);
      console.log("Section:", result.section);
      console.log("Text:", result.text);

      console.log();
    });

  } catch (error) {
    console.error(
      "Retrieval failed:",
      error
    );
  }
};

test();