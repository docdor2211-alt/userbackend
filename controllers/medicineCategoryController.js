
const MedicineCategory = require(
  "../models/medicineCategory.model"
);


// ==========================================
// ✅ CREATE CATEGORY
// ==========================================
exports.createMedicineCategory =
  async (req, res) => {
    try {

      const {
        category,
        title
      } = req.body;

      // ✅ VALIDATION
      if (!category || !title) {
        return res.status(400).json({
          success: false,
          message:
            "category & title required"
        });
      }

      // ✅ CREATE
      const data =
        await MedicineCategory.create({
          category,
          title,
          image: req.body.image || {}
        });

      res.status(201).json({
        success: true,
        message:
          "Medicine category created successfully",
        data
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ==========================================
// ✅ GET ALL
// ==========================================
exports.getMedicineCategories =
  async (req, res) => {
    try {

      const data =
        await MedicineCategory.find({
          isActive: true
        })

        .populate(
          "category",
          "title"
        )

        .sort({
          createdAt: -1
        });

      res.json({
        success: true,
        count: data.length,
        data
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ==========================================
// ✅ GET BY MAIN CATEGORY
// ==========================================
exports.getByCategory =
  async (req, res) => {
    try {

      const data =
        await MedicineCategory.find({
          category:
            req.params.id,

          isActive: true
        })

        .sort({
          createdAt: -1
        });

      res.json({
        success: true,
        count: data.length,
        data
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ==========================================
// ✅ GET SINGLE
// ==========================================
exports.getMedicineCategoryById =
  async (req, res) => {
    try {

      const data =
        await MedicineCategory.findById(
          req.params.id
        )

        .populate(
          "category",
          "title"
        );

      if (!data) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine category not found"
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



// ==========================================
// ✅ UPDATE
// ==========================================
exports.updateMedicineCategory =
  async (req, res) => {
    try {

      const updated =
        await MedicineCategory.findByIdAndUpdate(
          req.params.id,

          req.body,

          {
            new: true,
            runValidators: true
          }
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine category not found"
        });
      }

      res.json({
        success: true,
        message:
          "Medicine category updated successfully",
        data: updated
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ==========================================
// ✅ DELETE
// ==========================================
exports.deleteMedicineCategory =
  async (req, res) => {
    try {

      const deleted =
        await MedicineCategory.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine category not found"
        });
      }

      res.json({
        success: true,
        message:
          "Medicine category deleted successfully"
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };

