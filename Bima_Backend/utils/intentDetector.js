const INTENTS = {
    overview: [
        "overview",
        "about",
        "information",
        "details",
        "tell me about"
    ],

    benefits: [
        "benefit",
        "benefits",
        "advantages",
        "feature",
        "features"
    ],

    eligibility: [
        "eligible",
        "eligibility",
        "who can apply",
        "qualification"
    ],

    claimProcess: [
        "claim",
        "claim process",
        "how to claim",
        "cashless"
    ],

    documentsRequired: [
        "document",
        "documents",
        "aadhaar",
        "ration card",
        "required documents"
    ],

    premium: [
        "premium",
        "price",
        "cost",
        "fees"
    ],

    coverageAmount: [
        "coverage",
        "cover",
        "insured amount",
        "coverage amount"
    ],

    renewal: [
        "renew",
        "renewal"
    ],

    exclusions: [
        "exclude",
        "exclusions",
        "not covered"
    ],

    faq: [
        "faq",
        "question"
    ]
};

function detectIntent(question) {

    const q = question.toLowerCase();

    for (const [intent, keywords] of Object.entries(INTENTS)) {

        if (keywords.some(keyword => q.includes(keyword))) {
            return intent;
        }

    }

    return "overview";
}

module.exports = detectIntent;