const {
  generateEmbedding,
} = require("./service/rag/embeddingService");

const test = async () => {
  const text =
    "आयुष्मान भारतसाठी कोणती कागदपत्रे आवश्यक आहेत?";

  const embedding = await generateEmbedding(text);

  console.log("Embedding generated");
  console.log("Dimensions:", embedding.length);
  console.log("First 10 values:", embedding.slice(0, 10));
};

test();