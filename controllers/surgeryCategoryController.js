const SurgeryCategory = require("../models/SurgeryCategory");

// ➤ Create Category
exports.createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    name = name.trim();

    // check duplicate
    const exists = await SurgeryCategory.findOne({ name });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await SurgeryCategory.create({ name });

    res.status(201).json({
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

// ➤ Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const data = await SurgeryCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ Get Category By ID
exports.getCategoryById = async (req, res) => {
  try {
    const data = await SurgeryCategory.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ Update Category
exports.updateCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    name = name.trim();

    // duplicate check (exclude current id)
    const exists = await SurgeryCategory.findOne({
      name,
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const data = await SurgeryCategory.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const data = await SurgeryCategory.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
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