const Insurance = require("../models/Insurance");

/* ---------------------------------------
   Find Insurance by Name / Alias / Keyword
---------------------------------------- */

const detectInsurance = async (insuranceName) => {
  if (!insuranceName) return null;

  const insurances = await Insurance.find();

  const query = insuranceName.toLowerCase();

  for (const insurance of insurances) {
    const names = [
      insurance.name.en,
      insurance.name.hi,
      insurance.name.mr,
      ...(insurance.knowledgeBase.aliases || []),
      ...(insurance.knowledgeBase.keywords || []),
    ];

    if (
      names.some(
        (name) =>
          name &&
          (name.toLowerCase() === query ||
            name.toLowerCase().includes(query) ||
            query.includes(name.toLowerCase()))
      )
    ) {
      return insurance;
    }
  }

  return null;
};

/* ---------------------------------------
   Retrieve Context
---------------------------------------- */

const retrieveContext = (insurance, intent) => {
  if (!insurance) return "";

  switch (intent) {
    case "overview":
      return `
Overview:
${insurance.knowledgeBase.overview}

Benefits:
${insurance.knowledgeBase.benefits.join("\n")}

Eligibility:
${insurance.knowledgeBase.eligibility}

Claim Process:
${insurance.knowledgeBase.claimProcess}
`;

    case "benefits":
      return insurance.knowledgeBase.benefits.join("\n");

    case "eligibility":
      return insurance.knowledgeBase.eligibility;

    case "claimProcess":
      return insurance.knowledgeBase.claimProcess;

    case "documentsRequired":
      return insurance.knowledgeBase.documentsRequired.join("\n");

    case "premium":
      return `Premium: ${insurance.premium}`;

    case "coverage":
      return `Coverage Amount: ${insurance.coverageAmount}`;

    case "renewal":
      return insurance.knowledgeBase.renewal;

    case "exclusions":
      return insurance.knowledgeBase.exclusions;

    case "faq":
      return insurance.knowledgeBase.faqs
        .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
        .join("\n\n");

    default:
      return insurance.knowledgeBase.summary ||
             insurance.knowledgeBase.overview;
  }
};

module.exports = {
  detectInsurance,
  retrieveContext,
};