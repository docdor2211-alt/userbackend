const SubCategory = require("../models/subCategoryModel");


// ✅ CREATE SUBCATEGORY
exports.createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name & category required"
      });
    }

    const exist = await SubCategory.findOne({ name });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "SubCategory already exists"
      });
    }

    const data = await SubCategory.create({
      name,
      category
    });

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



// ✅ GET ALL (Pagination + Search + Filter by Category)
exports.getSubCategories = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search || "";
    const category = req.query.category;

    const skip = (page - 1) * limit;

    let query = {
      name: { $regex: search, $options: "i" }
    };

    // ✅ filter by category
    if (category) {
      query.category = category;
    }

    const total = await SubCategory.countDocuments(query);

    const data = await SubCategory.find(query)
      .populate("category") // 🔥 important
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



// ✅ GET SINGLE
exports.getSubCategoryById = async (req, res) => {
  try {
    const data = await SubCategory.findById(req.params.id)
      .populate("category");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



// ✅ UPDATE
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    const item = await SubCategory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });
    }

    if (name) item.name = name;
    if (category) item.category = category;

    await item.save();

    res.json({
      success: true,
      data: item
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



// ✅ DELETE
exports.deleteSubCategory = async (req, res) => {
  try {
    const item = await SubCategory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "SubCategory deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};