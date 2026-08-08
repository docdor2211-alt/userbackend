const PetCategory = require("../models/PetCategoryModel");


// ================= CREATE =================

exports.createPetCategory = async (req, res) => {

  try {

    const { title } = req.body;

    if (!title) {

      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // DUPLICATE CHECK
    const existing = await PetCategory.findOne({
      title: title.trim(),
    });

    if (existing) {

      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const data = await PetCategory.create({
      title,
    });

    res.status(201).json({

      success: true,

      data,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};


// ================= GET ALL =================

exports.getPetCategories = async (req, res) => {

  try {

    const data = await PetCategory.find()
      .sort({ createdAt: -1 });

    res.json({

      success: true,

      data,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};


// ================= DELETE =================

exports.deletePetCategory = async (req, res) => {

  try {

    const item = await PetCategory.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await item.deleteOne();

    res.json({

      success: true,

      message: "Category deleted successfully",
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};
// ================= UPDATE =================
exports.updatePetCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const item = await PetCategory.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check for duplicate (excluding current category)
    const existing = await PetCategory.findOne({
      title: title.trim(),
      _id: { $ne: id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category with this title already exists",
      });
    }

    item.title = title.trim();
    await item.save();

    res.json({
      success: true,
      data: item,
      message: "Category updated successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};