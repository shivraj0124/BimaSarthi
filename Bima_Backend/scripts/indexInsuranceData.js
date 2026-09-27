require("dotenv").config();

const mongoose = require("mongoose");
const Insurance = require("../models/Insurance");

const {
  generateEmbedding,
} = require("../service/rag/embeddingService");

const {
  upsertVectors,
} = require("../service/rag/pineconeService");

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;


// ==================================================
// Create chunk
// ==================================================

const createChunk = ({
  insurance,
  language,
  section,
  text,
}) => {
  if (!text || !String(text).trim()) {
    return null;
  }

  const insuranceName =
    insurance.name?.[language] ||
    insurance.name?.en ||
    "Unknown Insurance";

  return {
    id: `${insurance._id}-${language}-${section}`,

    text: String(text).trim(),

    metadata: {
      insuranceId:
        insurance._id.toString(),

      insuranceName,

      language,

      section,

      text: String(text).trim(),

      type:
        insurance.type || "",

      category:
        insurance.category || "",

      premium:
        insurance.premium || "",

      coverageAmount:
        insurance.coverageAmount || "",

      insuranceLink:
        insurance.insuranceLink || "",

      source:
        insurance.source || "",
    },
  };
};


// ==================================================
// Build insurance chunks
// ==================================================

const buildChunks = (insurance) => {
  const chunks = [];

  const languages = [
    "en",
    "hi",
    "mr",
  ];

  for (const language of languages) {

    const name =
      insurance.name?.[language];

    const shortDescription =
      insurance.shortDescription?.[
        language
      ];

    const overview =
      insurance.detailedInformation
        ?.overview?.[language];

    const eligibility =
      insurance.detailedInformation
        ?.eligibility?.[language];

    const claimProcess =
      insurance.detailedInformation
        ?.claimProcess?.[language];


    // ------------------------------------------
    // Basic information
    // ------------------------------------------

    const basicText = [
      `Insurance Name: ${name || ""}`,
      `Type: ${insurance.type || ""}`,
      `Category: ${insurance.category || ""}`,
      `Description: ${shortDescription || ""}`,
      `Coverage Amount: ${
        insurance.coverageAmount || ""
      }`,
      `Premium: ${
        insurance.premium || ""
      }`,
    ].join("\n");


    const basicChunk = createChunk({
      insurance,
      language,
      section: "basicInformation",
      text: basicText,
    });

    if (basicChunk) {
      chunks.push(basicChunk);
    }


    // ------------------------------------------
    // Overview
    // ------------------------------------------

    const overviewChunk = createChunk({
      insurance,
      language,
      section: "overview",
      text: [
        `Insurance: ${name || ""}`,
        `Overview: ${overview || ""}`,
      ].join("\n"),
    });

    if (overviewChunk) {
      chunks.push(overviewChunk);
    }


    // ------------------------------------------
    // Benefits
    // ------------------------------------------

    const benefits =
      insurance.detailedInformation
        ?.benefits || [];

    const translatedBenefits =
      benefits
        .map(
          (benefit) =>
            benefit?.[language]
        )
        .filter(Boolean);

    if (translatedBenefits.length) {

      const benefitsText = [
        `Insurance: ${name || ""}`,
        "Benefits:",
        ...translatedBenefits.map(
          (benefit) => `- ${benefit}`
        ),
      ].join("\n");

      const chunk = createChunk({
        insurance,
        language,
        section: "benefits",
        text: benefitsText,
      });

      if (chunk) {
        chunks.push(chunk);
      }
    }


    // ------------------------------------------
    // Eligibility
    // ------------------------------------------

    const eligibilityChunk = createChunk({
      insurance,
      language,
      section: "eligibility",
      text: [
        `Insurance: ${name || ""}`,
        `Eligibility: ${
          eligibility || ""
        }`,
      ].join("\n"),
    });

    if (eligibilityChunk) {
      chunks.push(eligibilityChunk);
    }


    // ------------------------------------------
    // Claim process
    // ------------------------------------------

    const claimChunk = createChunk({
      insurance,
      language,
      section: "claimProcess",
      text: [
        `Insurance: ${name || ""}`,
        `Claim Process: ${
          claimProcess || ""
        }`,
      ].join("\n"),
    });

    if (claimChunk) {
      chunks.push(claimChunk);
    }


    // ------------------------------------------
    // Documents
    // ------------------------------------------

    const documents =
      insurance.documentsRequired || [];

    const translatedDocuments =
      documents
        .map(
          (document) =>
            document?.[language]
        )
        .filter(Boolean);

    if (translatedDocuments.length) {

      const documentsText = [
        `Insurance: ${name || ""}`,
        "Documents Required:",
        ...translatedDocuments.map(
          (document) =>
            `- ${document}`
        ),
      ].join("\n");

      const chunk = createChunk({
        insurance,
        language,
        section: "documentsRequired",
        text: documentsText,
      });

      if (chunk) {
        chunks.push(chunk);
      }
    }


    // ------------------------------------------
    // Knowledge base
    // ------------------------------------------

    const kb =
      insurance.knowledgeBase;

    if (kb) {

      // These fields are currently common
      // English/source content in your schema.
      if (kb.summary) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "knowledgeBaseSummary",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Summary: ${kb.summary}`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.overview) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "knowledgeBaseOverview",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Overview: ${kb.overview}`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.benefits?.length) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "knowledgeBaseBenefits",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            "Additional Benefits:",
            ...kb.benefits.map(
              (item) => `- ${item}`
            ),
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.eligibility) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "knowledgeBaseEligibility",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Eligibility: ${
              kb.eligibility
            }`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.claimProcess) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "knowledgeBaseClaimProcess",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Claim Process: ${
              kb.claimProcess
            }`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (
        kb.documentsRequired?.length
      ) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "knowledgeBaseDocuments",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            "Documents Required:",
            ...kb.documentsRequired.map(
              (item) => `- ${item}`
            ),
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.exclusions) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "exclusions",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Exclusions: ${
              kb.exclusions
            }`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.renewal) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section:
            "renewal",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Renewal: ${
              kb.renewal
            }`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      // ----------------------------------------
      // FAQs
      // ----------------------------------------

      if (kb.faqs?.length) {

        kb.faqs.forEach(
          (faq, index) => {

            const faqText = [
              `Insurance: ${
                insurance.name?.en || ""
              }`,
              `Question: ${
                faq.question || ""
              }`,
              `Answer: ${
                faq.answer || ""
              }`,
            ].join("\n");

            const chunk =
              createChunk({
                insurance,
                language: "en",
                section:
                  `faq_${index + 1}`,
                text: faqText,
              });

            if (chunk) {
              chunks.push(chunk);
            }
          }
        );
      }


      // ----------------------------------------
      // Keywords / aliases
      // ----------------------------------------

      if (kb.keywords?.length) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section: "keywords",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Keywords: ${
              kb.keywords.join(", ")
            }`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.aliases?.length) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section: "aliases",
          text: [
            `Insurance: ${
              insurance.name?.en || ""
            }`,
            `Aliases: ${
              kb.aliases.join(", ")
            }`,
          ].join("\n"),
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }


      if (kb.combinedText) {

        const chunk = createChunk({
          insurance,
          language: "en",
          section: "combinedText",
          text: kb.combinedText,
        });

        if (chunk) {
          chunks.push(chunk);
        }
      }
    }


    // ------------------------------------------
    // Search text
    // ------------------------------------------

    if (insurance.searchText) {

      const chunk = createChunk({
        insurance,
        language: "en",
        section: "searchText",
        text: insurance.searchText,
      });

      if (chunk) {
        chunks.push(chunk);
      }
    }


    // ------------------------------------------
    // Tags
    // ------------------------------------------

    if (insurance.tags?.length) {

      const chunk = createChunk({
        insurance,
        language: "en",
        section: "tags",
        text: [
          `Insurance: ${
            insurance.name?.en || ""
          }`,
          `Tags: ${
            insurance.tags.join(", ")
          }`,
        ].join("\n"),
      });

      if (chunk) {
        chunks.push(chunk);
      }
    }


    // ------------------------------------------
    // Recommendation rules
    // ------------------------------------------

    const rules =
      insurance.recommendationRules;

    if (rules) {

      const recommendationText = [
        `Insurance: ${
          insurance.name?.en || ""
        }`,
        `Suitable Age Groups: ${
          rules.ageGroups?.join(", ") || ""
        }`,
        `Occupations: ${
          rules.occupations?.join(", ") || ""
        }`,
        `Income Ranges: ${
          rules.incomeRanges?.join(", ") || ""
        }`,
        `Priority: ${
          rules.priority ?? ""
        }`,
      ].join("\n");

      const chunk = createChunk({
        insurance,
        language: "en",
        section:
          "recommendationRules",
        text: recommendationText,
      });

      if (chunk) {
        chunks.push(chunk);
      }
    }
  }

  return chunks;
};


// ==================================================
// Index everything
// ==================================================

const indexInsuranceData = async () => {

  try {

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );


    const insurances =
      await Insurance.find({
        status: "ACTIVE",
      }).lean();


    console.log(
      `Found ${insurances.length} active insurance records`
    );


    let totalChunks = 0;


    for (const insurance of insurances) {

      console.log(
        `\nProcessing: ${
          insurance.name?.en
        }`
      );


      const chunks =
        buildChunks(insurance);


      console.log(
        `Chunks: ${chunks.length}`
      );


      const vectors = [];


      for (const chunk of chunks) {

        const embedding =
          await generateEmbedding(
            chunk.text
          );


        vectors.push({
          id: chunk.id,
          values: embedding,
          metadata: chunk.metadata,
        });


        totalChunks++;
      }


      const batchSize = 50;


      for (
        let i = 0;
        i < vectors.length;
        i += batchSize
      ) {

        const batch =
          vectors.slice(
            i,
            i + batchSize
          );


        await upsertVectors(
          batch
        );


        console.log(
          `Uploaded ${
            batch.length
          } vectors`
        );
      }
    }


    console.log(
      "\n=============================="
    );

    console.log(
      "INDEXING COMPLETED"
    );

    console.log(
      "=============================="
    );

    console.log(
      `Total chunks: ${totalChunks}`
    );

  } catch (error) {

    console.error(
      "INDEXING FAILED:"
    );

    console.error(error);

  } finally {

    await mongoose.disconnect();

  }
};


indexInsuranceData();