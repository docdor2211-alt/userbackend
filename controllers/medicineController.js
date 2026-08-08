const Medicine = require("../models/medicineModel");
const { uploadFile, deleteFile } = require("../utils/bunnyUpload"); // 👈 tera service

// ==============================
// 🔹 CREATE MEDICINE
// ==============================
exports.createMedicine = async (req, res) => {
  try {
    const { name, subCategory, medicineItems } = req.body;

    if (!name || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Name & SubCategory required",
      });
    }

    let imageData = {
      url: "",
      publicId: "",
    };

    // ✅ IMAGE UPLOAD (SERVICE USE)
    if (req.files && req.files.image && req.files.image.length > 0) {
      imageData = await uploadFile(req.files.image[0]);
    }

    // ✅ medicineItems handle
    let itemsArray = [];
    if (medicineItems) {
      itemsArray = Array.isArray(medicineItems)
        ? medicineItems
        : [medicineItems];
    }

    const medicine = await Medicine.create({
      name,
      subCategory,
      medicineItems: itemsArray,
      image: imageData,
    });

    res.status(201).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// 🔹 GET ALL
// ==============================
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    console.log("GET ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// 🔹 GET BY ID
// ==============================
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    console.log("GET BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// 🔹 UPDATE
// ==============================
exports.updateMedicine = async (req, res) => {
  try {
    const { name, subCategory, medicineItems } = req.body;

    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    if (name) medicine.name = name;
    if (subCategory) medicine.subCategory = subCategory;

    if (medicineItems) {
      medicine.medicineItems = Array.isArray(medicineItems)
        ? medicineItems
        : [medicineItems];
    }

    // ✅ IMAGE UPDATE
    if (req.files && req.files.image && req.files.image.length > 0) {
      // ❌ old image delete (optional)
      if (medicine.image.publicId) {
        await deleteFile(medicine.image.publicId);
      }

      medicine.image = await uploadFile(req.files.image[0]);
    }

    await medicine.save();

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// 🔹 DELETE
// ==============================
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // ❌ image delete (optional)
    if (medicine.image.publicId) {
      await deleteFile(medicine.image.publicId);
    }

    await medicine.deleteOne();

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};