
// controllers/medicineController.js

const Medicine =
  require("../models/Medicine");

// ==========================================
// ✅ CREATE MEDICINE
// ==========================================
exports.createMedicine =
  async (req, res) => {

    try {

      const {

        medicineCategory,

        name,

        type,

        delivery,

        oldPrice,

        newPrice,

        discount,

        prescription,

        imageUrl,

      } = req.body;

      // ✅ VALIDATION
      if (
        !medicineCategory ||
        !name ||
        !newPrice
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Medicine category, name and new price are required",
        });
      }

      // ✅ DUPLICATE CHECK
      const exists =
        await Medicine.findOne({

          medicineCategory,

          name:
            name.trim(),
        });

      if (exists) {

        return res.status(400).json({

          success: false,

          message:
            "Medicine already exists",
        });
      }

      // ✅ CREATE
      const medicine =
        await Medicine.create({

          medicineCategory,

          name:
            name.trim(),

          type,

          delivery,

          oldPrice,

          newPrice,

          discount,

          prescription,

          imageUrl,
        });

      return res.status(201).json({

        success: true,

        message:
          "Medicine created successfully",

        data:
          medicine,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

// ==========================================
// ✅ GET ALL MEDICINES
// ==========================================
exports.getMedicines =
  async (req, res) => {

    try {

      const data =
        await Medicine.find({

          isActive: true,

        })

          .populate(
            "medicineCategory",
            "title tag"
          )

          .sort({
            createdAt: -1,
          });

      return res.status(200).json({

        success: true,

        count:
          data.length,

        data,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

// ==========================================
// ✅ GET MEDICINES CATEGORY WISE
// ==========================================
exports.getMedicinesByCategory =
  async (req, res) => {

    try {

      const data =
        await Medicine.find({

          medicineCategory:
            req.params
              .medicineCategoryId,

          isActive: true,
        })

          .sort({
            createdAt: -1,
          });

      return res.status(200).json({

        success: true,

        count:
          data.length,

        data,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

// ==========================================
// ✅ GET SINGLE MEDICINE
// ==========================================
exports.getSingleMedicine =
  async (req, res) => {

    try {

      const medicine =
        await Medicine.findById(
          req.params.id
        ).populate(
          "medicineCategory",
          "title tag"
        );

      if (!medicine) {

        return res.status(404).json({

          success: false,

          message:
            "Medicine not found",
        });
      }

      return res.status(200).json({

        success: true,

        data:
          medicine,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

// ==========================================
// ✅ UPDATE MEDICINE
// ==========================================
exports.updateMedicine =
  async (req, res) => {

    try {

      const medicine =
        await Medicine.findById(
          req.params.id
        );

      if (!medicine) {

        return res.status(404).json({

          success: false,

          message:
            "Medicine not found",
        });
      }

      // ✅ UPDATE
      Object.assign(
        medicine,
        req.body
      );

      await medicine.save();

      return res.status(200).json({

        success: true,

        message:
          "Medicine updated successfully",

        data:
          medicine,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

// ==========================================
// ✅ DELETE MEDICINE
// ==========================================
exports.deleteMedicine =
  async (req, res) => {

    try {

      const medicine =
        await Medicine.findById(
          req.params.id
        );

      if (!medicine) {

        return res.status(404).json({

          success: false,

          message:
            "Medicine not found",
        });
      }

      await Medicine.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({

        success: true,

        message:
          "Medicine deleted successfully",
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

// ==========================================
// ✅ TOGGLE STATUS
// ==========================================
exports.toggleMedicineStatus =
  async (req, res) => {

    try {

      const medicine =
        await Medicine.findById(
          req.params.id
        );

      if (!medicine) {

        return res.status(404).json({

          success: false,

          message:
            "Medicine not found",
        });
      }

      medicine.isActive =
        !medicine.isActive;

      await medicine.save();

      return res.status(200).json({

        success: true,

        message:
          medicine.isActive
            ? "Medicine activated"
            : "Medicine deactivated",

        data:
          medicine,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }
  };

