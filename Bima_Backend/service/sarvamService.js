const fs = require("fs");
const { SarvamAIClient } = require("sarvamai");

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});
// console.log("SARVAM_API_KEY:", process.env.SARVAM_API_KEY);

const speechToText = async (filePath, languageCode) => {
  try {
    const file = fs.createReadStream(filePath);

    console.log("response", languageCode);
    const response = await client.speechToText.transcribe({
      file,
      model: "saaras:v4",
      language_code: languageCode,
      mode: "transcribe",
      sample_rate: 16000,
    });

    return response.transcript;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  speechToText,
};
