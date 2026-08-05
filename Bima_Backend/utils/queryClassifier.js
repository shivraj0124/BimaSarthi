const askGroq = require("../service/groqService");

const classifyQuestion = async (question) => {
const prompt = `
You are an Insurance Query Classifier.

Your ONLY job is to classify the user's question.

Do NOT answer the question.

Return ONLY valid JSON.

Schema:

{
  "isInsuranceRelated": true,
  "insuranceName": null,
  "intent": "general"
}

Supported Languages:
- English
- Hindi
- Marathi

Intent Rules:

1. general
Use ONLY when the user asks about insurance concepts in general.

Examples:
English:
- What is insurance?
- What is health insurance?
- What is premium?
- What is claim?

Hindi:
- बीमा क्या है?
- हेल्थ इंश्योरेंस क्या है?
- प्रीमियम क्या है?
- क्लेम क्या है?

Marathi:
- विमा काय आहे?
- आरोग्य विमा म्हणजे काय?
- प्रीमियम म्हणजे काय?
- क्लेम म्हणजे काय?

----------------------------------------------------

2. overview

Use when the user asks for information about a specific insurance scheme OR asks for more information about the previously discussed insurance.

Examples:

English:
- Tell me about Ayushman Bharat.
- Tell me more.
- Explain this insurance.
- Explain this scheme.
- Give more information.

Hindi:
- आयुष्मान भारत के बारे में बताइए।
- इस योजना के बारे में बताइए।
- इस बीमा के बारे में और जानकारी दीजिए।
- इसके बारे में और बताइए।
- और जानकारी दीजिए।

Marathi:
- आयुष्मान भारत बद्दल माहिती द्या.
- या विम्या बद्दल अजून माहिती द्या.
- या योजने बद्दल माहिती द्या.
- याबद्दल अजून सांगा.
- त्याबद्दल माहिती द्या.

----------------------------------------------------

3. benefits

Examples:

English:
- What are the benefits?
- Benefits of Ayushman Bharat

Hindi:
- इसके क्या लाभ हैं?
- इस योजना के फायदे क्या हैं?

Marathi:
- याचे फायदे काय आहेत?
- या योजनेचे फायदे काय आहेत?

----------------------------------------------------

4. eligibility

Examples:

English:
- Who is eligible?

Hindi:
- कौन पात्र है?
- पात्रता क्या है?

Marathi:
- कोण पात्र आहे?
- पात्रता काय आहे?

----------------------------------------------------

5. documentsRequired

Examples:

English:
- Required documents?
- Which documents are needed?

Hindi:
- कौन से दस्तावेज़ चाहिए?
- डॉक्यूमेंट्स कौन से लगते हैं?

Marathi:
- कोणती कागदपत्रे लागतात?
- डॉक्युमेंट्स कोणते लागतात?

----------------------------------------------------

6. claimProcess

Examples:

English:
- How to claim?

Hindi:
- क्लेम कैसे करें?

Marathi:
- क्लेम कसा करायचा?

----------------------------------------------------

7. premium

Examples:

English:
- Premium?
- Premium amount?

Hindi:
- प्रीमियम कितना है?

Marathi:
- प्रीमियम किती आहे?

----------------------------------------------------

8. coverage

Examples:

English:
- Coverage amount?
- How much coverage?

Hindi:
- कितना कवरेज मिलता है?

Marathi:
- किती संरक्षण मिळते?

----------------------------------------------------

Rules:

1. If an insurance scheme name is present, extract it.

2. If the user refers to:
English:
- this
- it
- this insurance
- this scheme
- tell me more

Hindi:
- यह
- इसके बारे में
- इस बीमा
- इस योजना
- इसके फायदे
- इसके दस्तावेज़

Marathi:
- या
- याबद्दल
- त्याबद्दल
- या विम्या
- या योजने
- याचे
- अजून माहिती

assume the user is referring to the insurance discussed previously.

3. In such cases:
insuranceName must be null.

The backend will resolve the insurance using conversation history.

4. NEVER classify follow-up questions as "general".

5. Use "general" ONLY when the user is asking about insurance as a concept.

Return ONLY valid JSON.

Question:

${question}
`;

  let response = await askGroq(prompt);

  console.log("Raw Response:", response);

  // Remove markdown code fences
  response = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // console.log("Clean Response:", response);

  return JSON.parse(response);
};

module.exports = classifyQuestion;