const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    /* ==============================
       BASIC IDENTITY (Signup)
    ============================== */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ==============================
       LANGUAGE PREFERENCE
    ============================== */
    preferredLanguage: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
    },

    /* ==============================
       PROFILE DETAILS (Optional)
    ============================== */
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    location: {
      village: String,
      district: String,
      state: String,
    },

    /* ==============================
       CHATBOT SURVEY SYSTEM
    ============================== */

    hasCompletedSurvey: {
      type: Boolean,
      default: false,
    },

    surveyResponses: {
      ageGroup: {
        type: String,
        enum: ["age_18_30", "age_31_45", "age_46_60", "age_60_plus"],
      },

      occupation: {
        type: String,
        enum: [
          "FARMER",
          "STUDENT",
          "LABORER",
          "SELF_EMPLOYED",
          "PRIVATE_JOB",
          "GOVERNMENT_JOB",
          "HOMEMAKER",
          "OTHER",
        ],
      },

      incomeRange: {
        type: String,
        enum: [
          "BELOW_1_LAKH",
          "ONE_TO_TWO_LAKH",
          "TWO_TO_FIVE_LAKH",
          "ABOVE_FIVE_LAKH",
        ],
      },

      primaryConcern: {
        type: String,
        enum: ["Health", "Life", "Crop", "Accident", "Other"]
      },

      familySize: Number,
      dependents: Number,
      hasExistingInsurance: Boolean,
    },

    /* ==============================
       CONVERSATIONAL SURVEY PROGRESS
    ============================== */

    surveyProgress: {
      currentStep: {
        type: Number,
        default: 0,
      },

      tempAnswers: {
        ageGroup: String,
        occupation: String,
        incomeRange: String,
        primaryConcern: String,
      },
    },

    /* ==============================
       RECOMMENDATION MEMORY
    ============================== */

    recommendedPlans: [
      {
        insuranceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Insurance",
        },
        recommendedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ==============================
       CHAT HISTORY
    ============================== */

    chatHistory: [
      {
        message: String,
        sender: {
          type: String,
          enum: ["USER", "BOT"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ==============================
       APP STATUS
    ============================== */

    lastLoginAt: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
