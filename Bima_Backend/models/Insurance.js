const mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema(
  {
    /* ---------- Basic Information ---------- */
    name: {
      en: { type: String, required: true },
      hi: { type: String },
      mr: { type: String },
    },

    type: {
      type: String,
      enum: ["Health", "Life", "Crop","Accident", "Other"],
      required: true,
    },

    category: {
      type: String,
      enum: ["Government", "Private"],
      required: true,
    },

    /* ---------- Short Description ---------- */
    shortDescription: {
      en: { type: String },
      hi: { type: String },
      mr: { type: String },
    },

    /* ---------- Detailed Structured Information ---------- */
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

    /* ---------- Financial Details ---------- */
    premium: {
      type: String, // Example: "₹330 per year"
    },

    coverageAmount: {
      type: String, // Example: "₹5,00,000"
    },

    /* ---------- Required Documents ---------- */
    documentsRequired: [
      {
        en: String,
        hi: String,
        mr: String,
      },
    ],

    /* ---------- Image ---------- */
    imageUrl: {
      type: String, // store cloud URL (Cloudinary / S3)
    },

    /* ---------- Status ---------- */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Insurance", InsuranceSchema);
