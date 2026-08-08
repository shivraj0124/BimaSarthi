const Insurance = require("../models/Insurance");

const insuranceCache = new Map();
const CACHE_DURATION = 1000 * 60 * 30;

exports.createInsurance = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      shortDescription,
      detailedInformation,
      documentsRequired,

      // AI
      knowledgeBase,

      // Recommendation
      recommendationRules,

      // Search
      searchText,
      tags,

      // Metadata
      premium,
      coverageAmount,
      imageUrl,
      insuranceLink,
      source,
      sourceLastUpdated,
      status,
    } = req.body;

    if (!name || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, type and category are required.",
      });
    }

    const existingInsurance = await Insurance.findOne({
      "name.en": {
        $regex: new RegExp(`^${name.en}$`, "i"),
      },
    });

    if (existingInsurance) {
      return res.status(409).json({
        success: false,
        message: "Insurance already exists.",
      });
    }

    const insurance = await Insurance.create({
      name,
      type,
      category,
      shortDescription,
      detailedInformation,
      documentsRequired,

      knowledgeBase,

      recommendationRules,

      searchText,
      tags,

      premium,
      coverageAmount,
      imageUrl,
      insuranceLink,
      source,
      sourceLastUpdated,
      status,
    });

    insuranceCache.clear();

    return res.status(201).json({
      success: true,
      message: "Insurance created successfully.",
      data: insurance,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error creating insurance.",
      error: error.message,
    });
  }
};


exports.getAllInsurance = async (req, res) => {
  try {
    const { category, type, search, lang = "en" } = req.query;

    const supportedLangs = ["en", "hi", "mr"];
    const selectedLang = supportedLangs.includes(lang) ? lang : "en";

    /* ---------------- CACHE KEY ---------------- */

    const cacheKey = JSON.stringify({
      category: category || "ALL",
      type: type || "ALL",
      search: search || "",
      lang: selectedLang,
    });

    /* ---------------- RETURN FROM CACHE ---------------- */

    if (insuranceCache.has(cacheKey)) {
      const cached = insuranceCache.get(cacheKey);

      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log("Serving insurance from cache");

        return res.status(200).json({
          success: true,
          source: "cache",
          count: cached.data.length,
          data: cached.data,
        });
      }

      insuranceCache.delete(cacheKey);
    }

    /* ---------------- DATABASE FILTER ---------------- */

    let filter = {
      status: "ACTIVE",
    };

    if (category) filter.category = category;
    if (type) filter.type = type;

    let insuranceList = await Insurance.find(filter).sort({ createdAt: -1 });

    /* ---------------- SEARCH ---------------- */

    if (search) {
      const searchLower = search.toLowerCase();

      insuranceList = insuranceList.filter((item) => {
        const nameMatch =
          item.name?.en?.toLowerCase().includes(searchLower) ||
          item.name?.hi?.toLowerCase().includes(searchLower) ||
          item.name?.mr?.toLowerCase().includes(searchLower);

        const keywordMatch = item.knowledgeBase?.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(searchLower)
        );

        const aliasMatch = item.knowledgeBase?.aliases?.some((alias) =>
          alias.toLowerCase().includes(searchLower)
        );

        return nameMatch || keywordMatch || aliasMatch;
      });
    }

    /* ---------------- FORMAT RESPONSE ---------------- */

    const formattedData = insuranceList.map((item) => ({
      _id: item._id,

      name: item.name?.[selectedLang] || item.name?.en || "",

      shortDescription:
        item.shortDescription?.[selectedLang] ||
        item.shortDescription?.en ||
        "",

      type: item.type,
      category: item.category,
      premium: item.premium || "",
      coverageAmount: item.coverageAmount || "",
      imageUrl: item.imageUrl || "",
      insuranceLink: item.insuranceLink || "",

      detailedInformation: {
        overview:
          item.detailedInformation?.overview?.[selectedLang] ||
          item.detailedInformation?.overview?.en ||
          "",

        eligibility:
          item.detailedInformation?.eligibility?.[selectedLang] ||
          item.detailedInformation?.eligibility?.en ||
          "",

        claimProcess:
          item.detailedInformation?.claimProcess?.[selectedLang] ||
          item.detailedInformation?.claimProcess?.en ||
          "",

        benefits:
          item.detailedInformation?.benefits?.map((benefit) =>
            benefit?.[selectedLang] || benefit?.en || ""
          ) || [],
      },

      documentsRequired:
        item.documentsRequired?.map((doc) =>
          doc?.[selectedLang] || doc?.en || ""
        ) || [],

      tags: item.tags || [],
      status: item.status,
      createdAt: item.createdAt,
    }));

    /* ---------------- SAVE TO CACHE ---------------- */

    insuranceCache.set(cacheKey, {
      data: formattedData,
      timestamp: Date.now(),
    });

    console.log("Serving insurance from database");

    return res.status(200).json({
      success: true,
      source: "database",
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Get all insurance error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching insurance",
      error: error.message,
    });
  }
};


exports.getInsuranceById = async (req, res) => {
  try {
    const { lang = "en" } = req.query;

    const supportedLangs = ["en", "hi", "mr"];
    const selectedLang = supportedLangs.includes(lang) ? lang : "en";

    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    const formattedData = {
      _id: insurance._id,

      name: insurance.name?.[selectedLang] || insurance.name?.en,

      shortDescription:
        insurance.shortDescription?.[selectedLang] ||
        insurance.shortDescription?.en,

      detailedInformation: {
        overview:
          insurance.detailedInformation?.overview?.[selectedLang] ||
          insurance.detailedInformation?.overview?.en,

        benefits:
          insurance.detailedInformation?.benefits?.map((b) =>
            b?.[selectedLang] || b?.en
          ) || [],

        eligibility:
          insurance.detailedInformation?.eligibility?.[selectedLang] ||
          insurance.detailedInformation?.eligibility?.en,

        claimProcess:
          insurance.detailedInformation?.claimProcess?.[selectedLang] ||
          insurance.detailedInformation?.claimProcess?.en,
      },

      documentsRequired:
        insurance.documentsRequired?.map((doc) =>
          doc?.[selectedLang] || doc?.en
        ) || [],

      type: insurance.type,
      category: insurance.category,
      premium: insurance.premium,
      coverageAmount: insurance.coverageAmount,
      imageUrl: insurance.imageUrl,
      insuranceLink: insurance.insuranceLink,
      status: insurance.status,
      createdAt: insurance.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Get insurance by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching insurance details",
      error: error.message,
    });
  }
};

exports.updateInsurance = async (req, res) => {
  try {
    const updated = await Insurance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    insuranceCache.clear();

    return res.status(200).json({
      success: true,
      message: "Insurance updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update insurance error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating insurance",
      error: error.message,
    });
  }
};


exports.deleteInsurance = async (req, res) => {
  try {
    const deleted = await Insurance.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    insuranceCache.clear();

    return res.status(200).json({
      success: true,
      message: "Insurance deleted successfully",
    });
  } catch (error) {
    console.error("Delete insurance error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting insurance",
      error: error.message,
    });
  }
};
