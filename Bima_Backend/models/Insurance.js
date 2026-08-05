const mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema(
  {
    /* ---------------- Basic Information ---------------- */

    name: {
      en: { type: String, required: true },
      hi: { type: String },
      mr: { type: String },
    },

    type: {
      type: String,
      enum: ["Health", "Life", "Crop", "Accident", "Other"],
      required: true,
    },

    category: {
      type: String,
      enum: ["Government", "Private"],
      required: true,
    },

    /* ---------------- UI Content ---------------- */

    shortDescription: {
      en: String,
      hi: String,
      mr: String,
    },

    detailedInformation: {
      overview: {
        en: String,
        hi: String,
        mr: String,
      },

      benefits: [
        {
          en: String,
          hi: String,
          mr: String,
        },
      ],

      eligibility: {
        en: String,
        hi: String,
        mr: String,
      },

      claimProcess: {
        en: String,
        hi: String,
        mr: String,
      },
    },

    documentsRequired: [
      {
        en: String,
        hi: String,
        mr: String,
      },
    ],

    /* ---------------- AI Knowledge Base ---------------- */

    knowledgeBase: {
      summary: String,

      overview: String,

      benefits: [String],

      eligibility: String,

      claimProcess: String,

      documentsRequired: [String],

      exclusions: String,

      renewal: String,

      faqs: [
        {
          question: String,
          answer: String,
        },
      ],

      keywords: [String],

      aliases: [String],

      combinedText: String,

      embedding: {
        type: [Number],
        default: [],
      },
    },

    /* ---------------- Recommendation ---------------- */

    recommendationRules: {
      ageGroups: [String],

      occupations: [String],

      incomeRanges: [String],

      priority: {
        type: Number,
        default: 1,
      },
    },

    /* ---------------- Search ---------------- */

    searchText: {
      type: String,
      default: "",
    },

    tags: [String],

    /* ---------------- Metadata ---------------- */

    premium: String,

    coverageAmount: String,

    imageUrl: String,

    insuranceLink: String,

    source: String,

    sourceLastUpdated: Date,

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- Indexes ---------------- */

InsuranceSchema.index({
  searchText: "text",
  "name.en": "text",
  "knowledgeBase.keywords": "text",
  "knowledgeBase.aliases": "text",
});

module.exports = mongoose.model("Insurance", InsuranceSchema);