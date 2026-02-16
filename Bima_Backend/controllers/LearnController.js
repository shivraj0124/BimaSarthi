const Learn = require("../models/Learn");


// ✅ CREATE (POST)
exports.createLearn = async (req, res) => {
    console.log("Hello")
  try {
    console.log("Request Body:", req.body);
    const learn = await Learn.create(req.body);
    res.status(201).json({
      success: true,
      data: learn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ GET ALL (with language support)
exports.getAllLearn = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const data = await Learn.find({ isActive: true }).sort({ order: 1 });

    const formatted = data.map(item => ({
      id: item._id,
      contentType: item.contentType,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
      duration: item.duration,
      tags: item.tags,
      views: item.views,
      title: item.content[lang]?.title || item.content.en.title,
      description:
        item.content[lang]?.description || item.content.en.description
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ GET SINGLE
exports.getSingleLearn = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const item = await Learn.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Learn content not found"
      });
    }

    const formatted = {
      id: item._id,
      contentType: item.contentType,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
      duration: item.duration,
      tags: item.tags,
      views: item.views,
      title: item.content[lang]?.title || item.content.en.title,
      description:
        item.content[lang]?.description || item.content.en.description
    };

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ UPDATE
exports.updateLearn = async (req, res) => {
  try {
    const updated = await Learn.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Learn content not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ DELETE
exports.deleteLearn = async (req, res) => {
  try {
    const deleted = await Learn.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Learn content not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Learn content deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
