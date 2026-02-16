const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function askAI(message, language = "en") {
  try {
    const languageMap = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
    };

    const selectedLanguage = languageMap[language] || "English";

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ updated working free model
      messages: [
        {
          role: "system",
          content: `You are an insurance assistant helping rural Indian users.
Reply strictly in ${selectedLanguage}.
Explain in simple words.
Keep response short and clear.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = askAI;
