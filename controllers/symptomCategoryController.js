const SymptomCategory = require("../models/symptomCategoryModel");
const { uploadFile } = require("../utils/bunnyUpload");

// CREATE
exports.createSymptomCategory = async (req, res) => {
  try {
    console.log("CONTENT TYPE =>", req.headers["content-type"]);
    console.log("BODY =>", req.body);
    console.log("FILES =>", req.files);

    const body = req.body || {};

    const name = body.name;
    const color = body.color;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    let imageData = {
      url: "https://via.placeholder.com/400x400?text=Category",
      publicId: "default",
    };

    if (req.files?.image?.length > 0) {
      const uploadRes = await uploadFile(req.files.image[0]);

      imageData = {
        url: uploadRes.url,
        publicId: uploadRes.publicId,
      };
    }

    const category = await SymptomCategory.create({
      name,
      color: color || "#3b82f6",
      image: imageData,
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getSymptomCategories = async (req, res) => {
  try {
    const categories = await SymptomCategory.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY ID
exports.getSymptomCategoryById = async (req, res) => {
  try {
    const category = await SymptomCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
exports.updateSymptomCategory = async (req, res) => {
  try {
    const category = await SymptomCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const body = req.body || {};

    if (body.name) category.name = body.name;
    if (body.color) category.color = body.color;

    if (req.files?.image?.length > 0) {
      const uploadRes = await uploadFile(req.files.image[0]);

      category.image = {
        url: uploadRes.url,
        publicId: uploadRes.publicId,
      };
    }

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
exports.deleteSymptomCategory = async (req, res) => {
  try {
    const category = await SymptomCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};