const Insurance = require("../models/Insurance");


const insuranceCache = new Map();
const CACHE_DURATION = 1000 * 60 * 30; 


exports.createInsurance = async (req, res) => {
  try {
    const insurance = new Insurance(req.body);
    await insurance.save();
    insuranceCache.clear();

    res.status(201).json({
      success: true,
      message: "Insurance created successfully",
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating insurance",
      error: error.message,
    });
  }
};


/* ---------------- GET ALL INSURANCE ---------------- */
// exports.getAllInsurance = async (req, res) => {
//   try {
//     const { category, type, search, lang = "en" } = req.query;

//     let filter = { isActive: true };

//     if (category) filter.category = category;
//     if (type) filter.type = type;

//     let insuranceList = await Insurance.find(filter);

//     // 🔍 Search (language-based)
//     if (search) {
//       insuranceList = insuranceList.filter((item) =>
//         item.name?.[lang]?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // 🌍 Format full structure by language
//     const formattedData = insuranceList.map((item) => ({
//       _id: item._id,
//       name: item.name?.[lang] || item.name?.en,
//       shortDescription:
//         item.shortDescription?.[lang] || item.shortDescription?.en,

//       type: item.type,
//       category: item.category,
//       premium: item.premium,
//       coverageAmount: item.coverageAmount,
//       imageUrl: item.imageUrl,

//       detailedInformation: {
//         overview:
//           item.detailedInformation?.overview?.[lang] ||
//           item.detailedInformation?.overview?.en,

//         eligibility:
//           item.detailedInformation?.eligibility?.[lang] ||
//           item.detailedInformation?.eligibility?.en,

//         claimProcess:
//           item.detailedInformation?.claimProcess?.[lang] ||
//           item.detailedInformation?.claimProcess?.en,

//         benefits:
//           item.detailedInformation?.benefits?.map((benefit) =>
//             benefit?.[lang] || benefit?.en
//           ) || [],
//       },

//       documentsRequired:
//         item.documentsRequired?.map(
//           (doc) => doc?.[lang] || doc?.en
//         ) || [],
//     }));

//     res.status(200).json({
//       success: true,
//       count: formattedData.length,
//       data: formattedData,   // ✅ FIXED
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching insurance",
//       error: error.message,
//     });
//   }
// };
// 30 minutes

exports.getAllInsurance = async (req, res) => {
  try {
    const { category, type, search, lang = "en" } = req.query;

    /* ================================
       CREATE UNIQUE CACHE KEY
    ================================= */

    const cacheKey = JSON.stringify({
      category: category || "ALL",
      type: type || "ALL",
      search: search || "",
      lang,
    });

    /* ================================
       RETURN FROM CACHE IF VALID
    ================================= */

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
      } else {
        insuranceCache.delete(cacheKey);
      }
    }

    /* ================================
       FETCH FROM DATABASE
    ================================= */

    let filter = { isActive: true };

    if (category) filter.category = category;
    if (type) filter.type = type;

    let insuranceList = await Insurance.find(filter);

    /* ================================
       SEARCH (LANGUAGE BASED)
    ================================= */

    if (search) {
      insuranceList = insuranceList.filter((item) =>
        item.name?.[lang]?.toLowerCase().includes(search.toLowerCase())
      );
    }

    /* ================================
       FORMAT LANGUAGE RESPONSE
    ================================= */

    const formattedData = insuranceList.map((item) => ({
      _id: item._id,
      name: item.name?.[lang] || item.name?.en,
      shortDescription:
        item.shortDescription?.[lang] || item.shortDescription?.en,

      type: item.type,
      category: item.category,
      premium: item.premium,
      coverageAmount: item.coverageAmount,
      imageUrl: item.imageUrl,

      detailedInformation: {
        overview:
          item.detailedInformation?.overview?.[lang] ||
          item.detailedInformation?.overview?.en,

        eligibility:
          item.detailedInformation?.eligibility?.[lang] ||
          item.detailedInformation?.eligibility?.en,

        claimProcess:
          item.detailedInformation?.claimProcess?.[lang] ||
          item.detailedInformation?.claimProcess?.en,

        benefits:
          item.detailedInformation?.benefits?.map(
            (benefit) => benefit?.[lang] || benefit?.en
          ) || [],
      },

      documentsRequired:
        item.documentsRequired?.map(
          (doc) => doc?.[lang] || doc?.en
        ) || [],
    }));

    /* ================================
       SAVE TO CACHE
    ================================= */

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
    return res.status(500).json({
      success: false,
      message: "Error fetching insurance",
      error: error.message,
    });
  }
};


exports.getInsuranceById = async (req, res) => {
  try {
    const { lang } = req.query;
    console.log("Language preference:", lang);

    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    const formattedData = {
      _id: insurance._id,
      name: insurance.name[lang],
      shortDescription: insurance.shortDescription?.[lang],
      detailedInformation: {
        overview: insurance.detailedInformation?.overview?.[lang],
        benefits:
          insurance.detailedInformation?.benefits?.map(
            (b) => b[lang]
          ) || [],
        eligibility:
          insurance.detailedInformation?.eligibility?.[lang],
        claimProcess:
          insurance.detailedInformation?.claimProcess?.[lang],
      },
      type: insurance.type,
      category: insurance.category,
      premium: insurance.premium,
      coverageAmount: insurance.coverageAmount,
      documentsRequired:
        insurance.documentsRequired?.map((doc) => doc[lang]) || [],
      imageUrl: insurance.imageUrl,
      createdAt: insurance.createdAt,
    };

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching insurance details",
      error: error.message,
    });
  }
};


exports.updateInsurance = async (req, res) => {
  try {
    const updated = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Insurance updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating insurance",
      error: error.message,
    });
  }
};



exports.deleteInsurance = async (req, res) => {
  try {
    await Insurance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Insurance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting insurance",
      error: error.message,
    });
  }
};

