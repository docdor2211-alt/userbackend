const Surgery = require("../models/surgeryModel");
const SurgeryCategory = require("../models/SurgeryCategory"); // ✅ FIXED
const { uploadFile, deleteFile } = require("../utils/bunnyUpload");


// 🔥 helpers
const parseArray = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [data];
    }
  }

  return [];
};


// =======================
// ✅ CREATE
// =======================
exports.createSurgery = async (req, res) => {
  try {
    const { name, category, duration, benefits, priceRange, doctors, icon } = req.body;

    if (!name || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, category, duration required"
      });
    }

    // ✅ category check
    const categoryExists = await SurgeryCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    let iconData = null;

    if (req.files?.icon?.length > 0) {
      const uploadRes = await uploadFile(req.files.icon[0]);

      iconData = {
        url: uploadRes.url,
        publicId: uploadRes.publicId
      };
    } else if (icon?.url && icon?.publicId) {
      iconData = icon;
    }

    if (!iconData) {
      return res.status(400).json({
        success: false,
        message: "Icon required"
      });
    }

    const surgery = await Surgery.create({
      name,
      category,
      duration,
      benefits: parseArray(benefits),
      priceRange,
      doctors: parseArray(doctors),
      icon: iconData
    });

    const populated = await Surgery.findById(surgery._id)
      .populate("category")
      .populate("doctors");

    res.status(201).json({
      success: true,
      data: populated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// =======================
// ✅ GET ALL
// =======================
exports.getSurgeries = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {
      name: { $regex: search, $options: "i" }
    };

    const total = await Surgery.countDocuments(query);

    const data = await Surgery.find(query)
      .populate("category")
      .populate("doctors")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// =======================
// ✅ GET ONE
// =======================
exports.getSurgeryById = async (req, res) => {
  try {
    const data = await Surgery.findById(req.params.id)
      .populate("category")
      .populate("doctors");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Surgery not found"
      });
    }

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// =======================
// ✅ UPDATE
// =======================
exports.updateSurgery = async (req, res) => {
  try {
    const item = await Surgery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Surgery not found"
      });
    }

    const { name, category, duration, benefits, priceRange, doctors, icon } = req.body;

    if (name) item.name = name;
    if (duration) item.duration = duration;
    if (priceRange) item.priceRange = priceRange;

    if (category) {
      const categoryExists = await SurgeryCategory.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID"
        });
      }
      item.category = category;
    }

    if (benefits) item.benefits = parseArray(benefits);
    if (doctors) item.doctors = parseArray(doctors);

    if (req.files?.icon?.length > 0) {
      if (item.icon?.publicId) await deleteFile(item.icon.publicId);

      const uploadRes = await uploadFile(req.files.icon[0]);

      item.icon = {
        url: uploadRes.url,
        publicId: uploadRes.publicId
      };
    }

    await item.save();

    res.json({ success: true, data: item });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// =======================
// ✅ DELETE
// =======================
exports.deleteSurgery = async (req, res) => {
  try {
    const item = await Surgery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Surgery not found"
      });
    }

    if (item.icon?.publicId) {
      await deleteFile(item.icon.publicId);
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};