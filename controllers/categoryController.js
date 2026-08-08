
// controllers/categoryController.js

const Category = require("../models/Category");
const { uploadToBunny } = require("../utils/bunnyUpload");
const axios = require("axios");

// ==========================================
// 🔥 DELETE IMAGE FROM BUNNY
// ==========================================
const deleteFromBunny = async (publicId) => {
  try {
    if (!publicId) return;

    const url = `${process.env.BUNNY_STORAGE}/${publicId}`;

    await axios.delete(url, {
      headers: {
        AccessKey: process.env.BUNNY_API_KEY,
      },
    });
  } catch (err) {
    console.log("Bunny delete error:", err.message);
  }
};

// ==========================================
// 🔥 CREATE CATEGORY
// ==========================================
exports.createCategory = async (req, res) => {
  try {
    const { title, image, isFree } = req.body;

    // ✅ REQUIRED
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category title is required",
      });
    }

    // ✅ DUPLICATE CHECK
    const exists = await Category.findOne({
      title: title.trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let imageData = {
      url: "",
      publicId: "",
    };

    // ✅ FILE IMAGE
    if (req.file) {
      imageData = await uploadToBunny(req.file);
    }

    // ✅ IMAGE URL
    else if (image) {
      imageData = {
        url: image,
        publicId: "",
      };
    }

    // ✅ CREATE
    const category = await Category.create({
      title: title.trim(),
      image: imageData,
      isFree:
        isFree === "true" ||
        isFree === true,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 🔥 GET ALL CATEGORIES
// ==========================================
// ==========================================
// 🔥 GET ALL CATEGORIES
// ==========================================
exports.getCategories = async (req, res) => {
  try {

    // ✅ FIXED ORDER
    const categoryOrder = [
      "In-Person Consultation",
      "Online Consultation",
      "Surgery",
      "Order Medicines",
      "Lab Test",
      "Pet Care",
    ];

    const categories = await Category.find().lean();

    // ✅ SORT ACCORDING TO FIXED ORDER
    const sortedCategories = categories.sort(
      (a, b) =>
        categoryOrder.indexOf(a.title) -
        categoryOrder.indexOf(b.title)
    );

    return res.status(200).json({
      success: true,
      count: sortedCategories.length,
      data: sortedCategories,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// 🔥 GET CATEGORY BY ID
// ==========================================
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    ).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 🔥 UPDATE CATEGORY
// ==========================================
exports.updateCategory = async (req, res) => {
  try {
    const {
      title,
      isActive,
      image,
      isFree,
    } = req.body;

    let updateData = {};

    // ✅ TITLE
    if (title && title.trim() !== "") {
      updateData.title = title.trim();
    }

    // ✅ ACTIVE STATUS
    if (typeof isActive !== "undefined") {
      updateData.isActive =
        isActive === "true" ||
        isActive === true;
    }

    // ✅ FREE / PAID
    if (typeof isFree !== "undefined") {
      updateData.isFree =
        isFree === "true" ||
        isFree === true;
    }

    const existing = await Category.findById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ NEW IMAGE FILE
    if (req.file) {
      // DELETE OLD IMAGE
      if (existing?.image?.publicId) {
        await deleteFromBunny(
          existing.image.publicId
        );
      }

      const imageData = await uploadToBunny(
        req.file
      );

      updateData.image = imageData;
    }

    // ✅ IMAGE URL
    else if (image) {
      updateData.image = {
        url: image,
        publicId: "",
      };
    }

    // ✅ UPDATE CATEGORY
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 🔥 DELETE CATEGORY
// ==========================================
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ DELETE IMAGE FROM BUNNY
    if (category?.image?.publicId) {
      await deleteFromBunny(
        category.image.publicId
      );
    }

    // ✅ DELETE CATEGORY
    await Category.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 🔥 TOGGLE CATEGORY STATUS
// ==========================================
exports.toggleCategoryStatus = async (
  req,
  res
) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ TOGGLE
    category.isActive = !category.isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive
          ? "activated"
          : "deactivated"
      }`,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};