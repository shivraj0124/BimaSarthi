const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const askGroq = async (prompt) => {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      messages: [
        {
          role: "system",
          content:
            "You are a helpful multilingual insurance assistant. Answer only using the provided context. If the answer is not available in the context, politely say you don't have enough information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "Groq Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to get response from Groq.");
  }
};

module.exports = askGroq;


// const { GoogleGenAI } = require("@google/genai");

// const client = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const askGroq = async (prompt) => {
//   try {
//     // console.log("Prompt sent to Gemini:", prompt);
//     const response = await client.models.generateContent({
//       model: "gemini-3.1-flash-lite",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `
// You are a helpful multilingual insurance assistant.

// Rules:
// - Answer only using the provided context.
// - Do not make up information.
// - If the answer is not available in the context, politely say you don't have enough information.

// ${prompt}
//               `,
//             },
//           ],
//         },
//       ],
//       generationConfig: {
//         temperature: 0.3,
//         maxOutputTokens: 1024,
//       },
//     });
//     console.log("Gemini Response:", response.text.trim());
//     return response.text.trim();
//   } catch (error) {
//     console.error(
//       "Gemini Error:",
//       error.response?.data || error.message
//     );

//     throw new Error("Failed to get response from Gemini.");
//   }
// };

// module.exports = askGroq;