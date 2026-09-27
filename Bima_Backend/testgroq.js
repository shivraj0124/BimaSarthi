require("dotenv").config();
const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function checkModels() {
  try {
    const models = await client.models.list();

    console.log("Available Groq models:");

    models.data.forEach((model) => {
      console.log(model.id);
    });
  } catch (error) {
    console.error("Groq Error:", error.message);
  }
}

checkModels();