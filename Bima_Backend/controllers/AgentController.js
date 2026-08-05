const User = require("../models/User");
const Insurance = require("../models/Insurance");
const askGemini = require("../service/gemini");
const {
  detectInsurance,
  retrieveContext,
} = require("../service/retrievalService");

const buildPrompt = require("../service/promptBuilder");

const askGroq = require("../service/groqService");
const isInsuranceQuestion = require("../utils/insuranceQuestion");
const classifyQuestion = require("../utils/queryClassifier");
const Chat = require("../models/Chat");
const { v4: uuidv4 } = require("uuid");

const AGE_GROUPS = ["age_18_30", "age_31_45", "age_46_60", "age_60_plus"];
const OCCUPATIONS = [
  "FARMER",
  "STUDENT",
  "LABORER",
  "SELF_EMPLOYED",
  "PRIVATE_JOB",
  "GOVERNMENT_JOB",
  "HOMEMAKER",
  "OTHER",
];

const INCOME_RANGES = [
  "BELOW_1_LAKH",
  "ONE_TO_TWO_LAKH",
  "TWO_TO_FIVE_LAKH",
  "ABOVE_FIVE_LAKH",
];

const CONCERNS = ["Health", "Life", "Crop", "Accident"];

exports.chatWithAgent = async (req, res) => {
  try {
    const { userId, action, value, language = "en" } = req.body;
    console.log("question", value);
    let { sessionId } = req.body;

    if (!sessionId) {
      sessionId = uuidv4();
    }
    if (!userId || !action) {
      return res
        .status(400)
        .json({ success: false, message: "userId and action are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    switch (action) {
      case "GET_RECOMMENDATION":
        return handleGetRecommendation(user, value, language, res);

      case "CLAIM_HELP":
        return claimHelp(user, language, res);
      case "CLAIM_FRAUD":
        return claimFraud(language, res);
      case "CANCEL_POLICY":
        return cancelPolicy(language, res);
      case "PREMIUM_INFO":
        return premiumInfo(language, res);

      // case "FREE_TEXT":
      //   const aiReply = await askGemini(value, language);
      //   return res.json({ reply: aiReply });

      case "FREE_TEXT": {
        if (!value || value.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Question is required.",
          });
        }
        // console.log("FREE_TEXT action received with value:", value);

        const classification = await classifyQuestion(value);
        // console.log("Classification:", classification);

        /* ---------------- Reject Unrelated Questions ---------------- */

        if (!classification.isInsuranceRelated) {
          let reply;

          switch (language) {
            case "mr":
              reply =
                "क्षमस्व, मी फक्त विमा आणि विमा योजनांशी संबंधित प्रश्नांची उत्तरे देऊ शकतो.";
              break;

            case "hi":
              reply =
                "क्षमा करें, मैं केवल बीमा और बीमा योजनाओं से जुड़े प्रश्नों के उत्तर दे सकता हूँ।";
              break;

            default:
              reply =
                "Sorry, I can only answer questions related to insurance and insurance schemes.";
          }

          return res.json({
            success: true,
            reply,
          });
        }

        /* ---------------- General Insurance Question ---------------- */

        //         if (classification.intent === "general" && !insurance) {
        //           const prompt = `
        // You are an insurance expert.

        // Answer only insurance-related questions.

        // Reply in ${
        //             language === "mr"
        //               ? "Marathi"
        //               : language === "hi"
        //                 ? "Hindi"
        //                 : "English"
        //           }.

        // Question:
        // ${value}
        // `;

        //           const aiReply = await askGroq(prompt);
        //           // console.log("AI Reply:", aiReply);
        //           // Save USER message
        //           await Chat.create({
        //             userId,
        //             sessionId,
        //             role: "USER",
        //             message: value,
        //             language,
        //             insuranceId: null,
        //             intent: classification.intent,
        //             isInsuranceRelated: true,
        //           });

        //           // Save AI message
        //           await Chat.create({
        //             userId,
        //             sessionId,
        //             role: "ASSISTANT",
        //             message: aiReply,
        //             language,
        //             insuranceId: null,
        //             intent: classification.intent,
        //             isInsuranceRelated: true,
        //           });

        //           return res.json({
        //             success: true,
        //             reply: aiReply,
        //           });
        //         }

        if (classification.intent === "general") {
          console.log("Inside GENERAL block");

          const prompt = `
You are an insurance expert.

Answer only insurance-related questions.

Reply in ${
            language === "mr"
              ? "Marathi"
              : language === "hi"
                ? "Hindi"
                : "English"
          }.

Question:
${value}
`;

          const aiReply = await askGroq(prompt);

          console.log("General Reply:", aiReply);

          return res.json({
            success: true,
            reply: aiReply,
            sessionId,
          });
        }

        /* ---------------- Detect Insurance ---------------- */

        let insurance = null;

        // 1. Insurance name is present in current question
        if (classification.insuranceName) {
          insurance = await detectInsurance(classification.insuranceName);
        }

        // 2. No insurance name -> use conversation memory
        else {
          const lastInsuranceChat = await Chat.findOne({
            userId,
            sessionId,
            insuranceId: { $ne: null },
          })
            .sort({ createdAt: -1 })
            .lean();

          if (lastInsuranceChat) {
            insurance = await Insurance.findById(lastInsuranceChat.insuranceId);
          }
        }

        console.log("Detected Insurance:", insurance?.name?.en);

        /* ---------------- Insurance Not Found ---------------- */

        if (!insurance) {
          let reply;

          switch (language) {
            case "mr":
              reply = "मला त्या विमा योजनेची माहिती सापडली नाही.";
              break;

            case "hi":
              reply = "मुझे उस बीमा योजना की जानकारी नहीं मिली।";
              break;

            default:
              reply = "I couldn't find that insurance scheme.";
          }

          return res.json({
            success: true,
            reply,
          });
        }

        /* ---------------- Save USER Message ---------------- */

        await Chat.create({
          userId,
          sessionId,
          role: "USER",
          message: value,
          language,
          insuranceId: insurance._id,
          intent: classification.intent,
          isInsuranceRelated: true,
        });

        /* ---------------- Retrieve Context ---------------- */
        const intent =
          classification.intent === "general"
            ? "overview"
            : classification.intent;

        const context = retrieveContext(insurance, intent);
        // const context = retrieveContext(insurance, classification.intent);

        /* ---------------- Retrieve Chat History ---------------- */

        const history = await Chat.find({
          userId,
          sessionId,
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        /* ---------------- Build Prompt ---------------- */

        const prompt = buildPrompt({
          question: value,
          context,
          history,
          language,
        });

        /* ---------------- Ask Groq ---------------- */

        const aiReply = await askGroq(prompt);

        /* ---------------- Save AI Message ---------------- */

        await Chat.create({
          userId,
          sessionId,
          role: "ASSISTANT",
          message: aiReply,
          language,
          insuranceId: insurance._id,
          intent: classification.intent,
          isInsuranceRelated: true,
        });

        /* -------- -------- Response ---------------- */
        console.log("answer: ", aiReply);
        return res.json({
          success: true,
          reply: aiReply,
          insurance: insurance.name[language] || insurance.name.en,
          sessionId,
        });
      }

      default:
        return generalReply(language, res);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/* =========================================
   HANDLE GET_RECOMMENDATION (single entry point)
========================================= */

const handleGetRecommendation = async (user, value, language, res) => {
  // ✅ Survey already fully completed → show recommendation directly
  if (user.hasCompletedSurvey) {
    return generateRecommendation(user, language, res);
  }

  const step = user.surveyProgress.currentStep;

  // Step 0: No answer yet → show age question
  // (This also handles the case where user came back without answering)
  if (step === 0 && !value) {
    // Ensure tempAnswers is clean when starting fresh
    if (!user.surveyProgress.tempAnswers) {
      user.surveyProgress.tempAnswers = {};
      await user.save();
    }
    return res.json({
      reply: getMessage("AGE_QUESTION", language),
      options: AGE_GROUPS,
    });
  }

  // Survey in progress → process the submitted value for the current step
  return continueSurvey(user, value, language, res);
};

/* =========================================
   CONTINUE SURVEY
========================================= */

const continueSurvey = async (user, value, language, res) => {
  const step = user.surveyProgress.currentStep;

  // Guard: no value submitted → re-ask the same step
  if (!value) {
    return askCurrentStep(step, language, res);
  }

  /* -------- STEP 0: AGE -------- */
  if (step === 0) {
    if (!AGE_GROUPS.includes(value)) {
      return res.json({
        reply: getMessage("INVALID_AGE", language),
        options: AGE_GROUPS,
      });
    }
    user.surveyProgress.tempAnswers.ageGroup = value;
    user.surveyProgress.currentStep = 1;
    await user.save();
    return res.json({
      reply: getMessage("OCCUPATION_QUESTION", language),
      options: OCCUPATIONS,
    });
  }

  /* -------- STEP 1: OCCUPATION -------- */
  if (step === 1) {
    if (!OCCUPATIONS.includes(value)) {
      return res.json({
        reply: getMessage("INVALID_OCCUPATION", language),
        options: OCCUPATIONS,
      });
    }
    user.surveyProgress.tempAnswers.occupation = value;
    user.surveyProgress.currentStep = 2;
    await user.save();
    return res.json({
      reply: getMessage("INCOME_QUESTION", language),
      options: INCOME_RANGES,
    });
  }

  /* -------- STEP 2: INCOME -------- */
  if (step === 2) {
    if (!INCOME_RANGES.includes(value)) {
      return res.json({
        reply: getMessage("INVALID_INCOME", language),
        options: INCOME_RANGES,
      });
    }
    user.surveyProgress.tempAnswers.incomeRange = value;
    user.surveyProgress.currentStep = 3;
    await user.save();
    return res.json({
      reply: getMessage("CONCERN_QUESTION", language),
      options: CONCERNS,
    });
  }

  /* -------- STEP 3: PRIMARY CONCERN -------- */
  if (step === 3) {
    if (!CONCERNS.includes(value)) {
      return res.json({
        reply: getMessage("INVALID_CONCERN", language),
        options: CONCERNS,
      });
    }

    user.surveyProgress.tempAnswers.primaryConcern = value;
    const { ageGroup, occupation, incomeRange, primaryConcern } =
      user.surveyProgress.tempAnswers;

    // Final validation — all 4 answers must be present
    if (!ageGroup || !occupation || !incomeRange || !primaryConcern) {
      // Something went wrong mid-session — reset to step 0
      user.surveyProgress.currentStep = 0;
      user.surveyProgress.tempAnswers = {};
      await user.save();
      return res.json({
        reply: getMessage("SURVEY_RESTART", language),
        options: AGE_GROUPS,
      });
    }

    // ✅ All valid → persist permanently
    user.surveyResponses = {
      ageGroup,
      occupation,
      incomeRange,
      primaryConcern,
    };
    user.hasCompletedSurvey = true;
    user.surveyProgress.currentStep = 4;
    user.surveyProgress.tempAnswers = {};
    await user.save();

    return generateRecommendation(user, language, res);
  }
};

/* =========================================
   HELPER: Re-ask the question for current step
========================================= */

const askCurrentStep = (step, language, res) => {
  const stepMap = [
    { msg: "AGE_QUESTION", options: AGE_GROUPS },
    { msg: "OCCUPATION_QUESTION", options: OCCUPATIONS },
    { msg: "INCOME_QUESTION", options: INCOME_RANGES },
    { msg: "CONCERN_QUESTION", options: CONCERNS },
  ];
  const current = stepMap[step];
  if (!current)
    return res.json({ reply: getMessage("GENERIC_ERROR", language) });
  return res.json({
    reply: getMessage(current.msg, language),
    options: current.options,
  });
};

/* =========================================
   RECOMMENDATION ENGINE
========================================= */

const generateRecommendation = async (user, language, res) => {
  // 🔴 If survey not completed OR data missing → start survey
  if (
    !user.hasCompletedSurvey ||
    !user.surveyResponses ||
    !user.surveyResponses.ageGroup ||
    !user.surveyResponses.occupation ||
    !user.surveyResponses.incomeRange ||
    !user.surveyResponses.primaryConcern
  ) {
    return startSurvey(user, language, res);
  }

  const concern = user.surveyResponses.primaryConcern;
  console.log("Generating recommendations for concern:", concern);

  const plans = await Insurance.find({ type: concern });

  const recommendations = plans.map((p) => ({
    id: p._id,
    name: p.name?.[language] || p.name?.en,
    description: p.shortDescription?.[language] || p.shortDescription?.en,
    insuranceLink: p.insuranceLink,
  }));

  return res.json({
    reply: getMessage("RECOMMEND_RESULT", language),
    recommendations,
  });
};

/* =========================================
   OTHER ACTIONS
========================================= */

// const claimHelp = (language, res) => {
//     return res.json({
//         reply: getMessage("CLAIM_HELP", language),
//     });
// };
const claimHelp = (user, language, res) => {
  console.log("User in claimHelp:", user);
  const type = user.surveyResponses?.primaryConcern;

  if (!type) {
    return res.json({
      reply:
        language === "hi"
          ? "कृपया पहले बीमा प्रकार चुनें।"
          : language === "mr"
            ? "कृपया आधी विमा प्रकार निवडा."
            : "Please select your insurance type first.",
    });
  }

  let reply;

  switch (type) {
    case "Health":
      reply =
        language === "hi"
          ? "स्वास्थ्य बीमा क्लेम के लिए अधिकृत अस्पताल जाएं और पहचान पत्र साथ रखें।"
          : language === "mr"
            ? "आरोग्य विम्यासाठी अधिकृत रुग्णालयात जा आणि ओळखपत्र बाळगा."
            : "For health insurance claim, visit an empaneled hospital with your ID proof.";
      break;

    case "Life":
      reply =
        language === "hi"
          ? "जीवन बीमा क्लेम के लिए मृत्यु प्रमाण पत्र और पॉलिसी दस्तावेज़ जमा करें।"
          : language === "mr"
            ? "जीवन विमा क्लेमसाठी मृत्यू प्रमाणपत्र आणि पॉलिसी कागदपत्रे सादर करा."
            : "For life insurance claim, submit death certificate and policy documents to the insurer.";
      break;

    case "Crop":
      reply =
        language === "hi"
          ? "फसल बीमा क्लेम के लिए नुकसान की सूचना स्थानीय कृषि अधिकारी को दें।"
          : language === "mr"
            ? "पिक विमा क्लेमसाठी नुकसानाची माहिती स्थानिक कृषी अधिकाऱ्यांना द्या."
            : "For crop insurance claim, report crop damage to the local agriculture officer immediately.";
      break;

    case "Accident":
      reply =
        language === "hi"
          ? "दुर्घटना बीमा क्लेम के लिए पुलिस रिपोर्ट और मेडिकल दस्तावेज़ जमा करें।"
          : language === "mr"
            ? "अपघात विमा क्लेमसाठी पोलीस अहवाल आणि वैद्यकीय कागदपत्रे सादर करा."
            : "For accident insurance claim, submit police report and medical documents.";
      break;

    default:
      reply =
        language === "hi"
          ? "कृपया क्लेम का प्रकार चुनें।"
          : language === "mr"
            ? "कृपया क्लेम प्रकार निवडा."
            : "Please select the type of insurance claim.";
  }

  return res.json({
    reply,
    redirect: {
      label: "fileClaimNow",
      route: "ClaimSc",
    },
  });
};

const claimFraud = (language, res) => {
  return res.json({
    redirect: {
      label: "reportFraud",
      route: "FraudSc",
    },
    reply:
      language === "hi"
        ? "बीमा धोखाधड़ी अवैध है। यदि आपका दावा सही है, तो मैं आपकी मदद कर सकता हूँ।"
        : language === "mr"
          ? "विमा फसवणूक बेकायदेशीर आहे. जर तुमचा दावा योग्य असेल तर मी मदत करू शकतो."
          : "Insurance fraud is illegal and punishable by law.",
  });
};

const cancelPolicy = (language, res) => {
  return res.json({
    reply:
      language === "hi"
        ? "पॉलिसी रद्द करने के लिए कृपया अपने बीमा प्रदाता से संपर्क करें।"
        : language === "mr"
          ? "पॉलिसी रद्द करण्यासाठी कृपया विमा प्रदात्याशी संपर्क साधा."
          : "To cancel your policy, please contact your insurance provider.",
  });
};

const premiumInfo = (language, res) => {
  return res.json({
    redirect: {
      label: "premiumDetails",
      route: "insurance",
    },
    reply:
      language === "hi"
        ? "प्रीमियम योजना और कवरेज पर निर्भर करता है।"
        : language === "mr"
          ? "प्रीमियम योजना आणि कव्हरेजवर अवलंबून असतो."
          : "Premium depends on your selected insurance plan and coverage.",
  });
};

const generalReply = (language, res) => {
  return res.json({
    reply: getMessage("GENERAL", language),
  });
};

/* =========================================
   MULTILINGUAL MESSAGES
========================================= */

const getMessage = (key, lang) => {
  const messages = {
    AGE_QUESTION: {
      en: "What is your age group?",
      hi: "आपकी आयु समूह क्या है?",
      mr: "तुमचा वयोगट कोणता आहे?",
    },
    OCCUPATION_QUESTION: {
      en: "What is your occupation?",
      hi: "आपका व्यवसाय क्या है?",
      mr: "तुमचा व्यवसाय काय आहे?",
    },
    INCOME_QUESTION: {
      en: "What is your income range?",
      hi: "आपकी आय सीमा क्या है?",
      mr: "तुमचे उत्पन्न किती आहे?",
    },
    CONCERN_QUESTION: {
      en: "What do you want to protect?",
      hi: "आप क्या सुरक्षित करना चाहते हैं?",
      mr: "तुम्हाला काय सुरक्षित करायचे आहे?",
    },
    RECOMMEND_RESULT: {
      en: "Based on your answers, these plans are suitable:",
      hi: "आपके उत्तरों के आधार पर ये योजनाएं उपयुक्त हैं:",
      mr: "तुमच्या उत्तरांनुसार या योजना योग्य आहेत:",
    },
    CLAIM_HELP: {
      en: "To claim insurance, visit an empaneled hospital with ID proof.",
      hi: "क्लेम करने के लिए पहचान पत्र के साथ अधिकृत अस्पताल जाएं।",
      mr: "क्लेम करण्यासाठी ओळखपत्रासह अधिकृत रुग्णालयात जा.",
    },
    GENERAL: {
      en: "I can help you with insurance recommendations and claims.",
      hi: "मैं बीमा सुझाव और क्लेम में आपकी मदद कर सकता हूँ।",
      mr: "मी विमा शिफारसी आणि क्लेममध्ये मदत करू शकतो.",
    },
    INVALID_AGE: {
      en: "Please select a valid age group.",
      hi: "कृपया सही आयु समूह चुनें।",
      mr: "कृपया योग्य वयोगट निवडा.",
    },
    INVALID_OCCUPATION: {
      en: "Please select a valid occupation.",
      hi: "कृपया सही व्यवसाय चुनें।",
      mr: "कृपया योग्य व्यवसाय निवडा.",
    },
    INVALID_INCOME: {
      en: "Please select a valid income range.",
      hi: "कृपया सही आय सीमा चुनें।",
      mr: "कृपया योग्य उत्पन्न श्रेणी निवडा.",
    },
    INVALID_CONCERN: {
      en: "Please select a valid option.",
      hi: "कृपया सही विकल्प चुनें।",
      mr: "कृपया योग्य पर्याय निवडा.",
    },
    INVALID_OPTION: {
      en: "Invalid selection. Please choose a valid option.",
      hi: "अमान्य चयन। कृपया सही विकल्प चुनें।",
      mr: "अवैध निवड. कृपया योग्य पर्याय निवडा.",
    },
  };

  return messages[key]?.[lang] || messages[key]?.en;
};
