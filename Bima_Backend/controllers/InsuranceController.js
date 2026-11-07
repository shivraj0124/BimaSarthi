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

exports.createInsuranceBulk = async (req, res) => {
  try {
    const { insurances } = req.body;

    // 1. Validate request
    if (!Array.isArray(insurances) || insurances.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a non-empty array of insurance records.",
      });
    }

    // Prevent accidentally submitting an excessively large batch
    if (insurances.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Maximum 100 insurance records can be submitted at once.",
      });
    }

    const results = [];
    const seenNames = new Set();

    // 2. Process records individually so one failure
    // doesn't prevent other valid records from being saved
    for (let i = 0; i < insurances.length; i++) {
      const record = insurances[i];

      try {
        // Validate required fields
        if (
          !record ||
          !record.name ||
          typeof record.name.en !== "string" ||
          !record.name.en.trim() ||
          !record.type ||
          !record.category
        ) {
          results.push({
            index: i,
            name: record?.name?.en || null,
            success: false,
            message: "Name (English), type and category are required.",
          });

          continue;
        }

        const insuranceName = record.name.en.trim();
        const normalizedName = insuranceName.toLowerCase();

        // 3. Detect duplicate names within the submitted batch
        if (seenNames.has(normalizedName)) {
          results.push({
            index: i,
            name: insuranceName,
            success: false,
            message: "Duplicate insurance name in the submitted batch.",
          });

          continue;
        }

        seenNames.add(normalizedName);

        // 4. Check whether insurance already exists in MongoDB
        const escapedName = insuranceName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

        const existingInsurance = await Insurance.findOne({
          "name.en": {
            $regex: `^${escapedName}$`,
            $options: "i",
          },
        });

        if (existingInsurance) {
          results.push({
            index: i,
            name: insuranceName,
            success: false,
            message: "Insurance already exists.",
          });

          continue;
        }

        // 5. Validate against the Mongoose schema
        const insurance = new Insurance(record);

        await insurance.validate();

        // 6. Save the individual record
        await insurance.save();

        results.push({
          index: i,
          name: insuranceName,
          success: true,
          message: "Insurance created successfully.",
          insuranceId: insurance._id,
        });
      } catch (error) {
        // Handle validation or database errors for this record
        results.push({
          index: i,
          name: record?.name?.en || null,
          success: false,
          message: error.message,
        });
      }
    }

    // 7. Calculate summary
    const successful = results.filter((item) => item.success);
    const failed = results.filter((item) => !item.success);

    // 8. Clear cache if at least one record was saved
    if (successful.length > 0) {
      insuranceCache.clear();
    }

    return res.status(successful.length > 0 ? 201 : 400).json({
      success: failed.length === 0,
      message:
        failed.length === 0
          ? "All insurance records created successfully."
          : successful.length > 0
            ? "Bulk insertion completed with some failures."
            : "No insurance records were created.",
      summary: {
        total: insurances.length,
        successful: successful.length,
        failed: failed.length,
      },
      results,
    });
  } catch (error) {
    console.error("Bulk insurance creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Error processing bulk insurance creation.",
      error: error.message,
    });
  }
};

exports.getAllInsurance = async (req, res) => {
  try {
    const { category, type, search, lang = "en" } = req.query;

    const supportedLangs = ["en", "hi", "mr"];
    const selectedLang = supportedLangs.includes(lang) ? lang : "en";


    const cacheKey = JSON.stringify({
      category: category || "ALL",
      type: type || "ALL",
      search: search || "",
      lang: selectedLang,
    });


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


    let filter = {
      status: "ACTIVE",
    };

    if (category) filter.category = category;
    if (type) filter.type = type;

    let insuranceList = await Insurance.find(filter).sort({ createdAt: -1 });


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
