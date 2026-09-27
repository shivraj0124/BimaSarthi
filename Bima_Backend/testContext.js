const {
  buildRagContext,
} = require("./service/rag/contextService");

const context = buildRagContext({
  question:
    "What documents are required?",

  insurance: {
    name: {
      en: "Ayushman Bharat",
    },
  },

  recentMessages: [
    {
      role: "USER",
      message: "Tell me about Ayushman Bharat",
    },
    {
      role: "ASSISTANT",
      message:
        "Ayushman Bharat is a government health insurance scheme.",
    },
  ],

  retrievedChunks: [
    {
      insuranceName: "Ayushman Bharat",
      section: "documentsRequired",
      language: "en",
      text:
        "Ayushman Card, Aadhaar Card and other required documents may be needed.",
    },
  ],
});

console.log(context);