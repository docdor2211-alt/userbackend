
const MedicineSubCategory =
  require(
    "../models/medicineSubCategory.model"
  );


// ==========================================
// ✅ CREATE
// ==========================================
exports.createMedicineSubCategory =
  async (req, res) => {
    try {

      const {
        medicineCategory,
        title
      } = req.body;

      if (
        !medicineCategory ||
        !title
      ) {
        return res.status(400).json({
          success: false,
          message:
            "medicineCategory & title required"
        });
      }

      const data =
        await MedicineSubCategory.create({
          medicineCategory,
          title,
          image: req.body.image || {}
        });

      res.status(201).json({
        success: true,
        message:
          "Medicine sub category created successfully",
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
exports.getMedicineSubCategories =
  async (req, res) => {
    try {

      const data =
        await MedicineSubCategory.find({
          isActive: true
        })

        .populate(
          "medicineCategory",
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
// ✅ GET BY CATEGORY
// ==========================================
exports.getByMedicineCategory =
  async (req, res) => {
    try {

      const data =
        await MedicineSubCategory.find({
          medicineCategory:
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
exports.getMedicineSubCategoryById =
  async (req, res) => {
    try {

      const data =
        await MedicineSubCategory.findById(
          req.params.id
        )

        .populate(
          "medicineCategory",
          "title"
        );

      if (!data) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine sub category not found"
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
exports.updateMedicineSubCategory =
  async (req, res) => {
    try {

      const updated =
        await MedicineSubCategory.findByIdAndUpdate(
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
            "Medicine sub category not found"
        });
      }

      res.json({
        success: true,
        message:
          "Medicine sub category updated successfully",
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
exports.deleteMedicineSubCategory =
  async (req, res) => {
    try {

      const deleted =
        await MedicineSubCategory.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine sub category not found"
        });
      }

      res.json({
        success: true,
        message:
          "Medicine sub category deleted successfully"
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };

