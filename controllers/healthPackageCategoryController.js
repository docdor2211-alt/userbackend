// controllers/healthPackageCategoryController.js

const HealthPackageCategory = require(
  "../models/healthPackageCategoryModel"
);



// ================= CREATE CATEGORY =================

exports.createHealthPackageCategory =
  async (req, res) => {

    try {

      const { title } = req.body;


      // ================= VALIDATION =================

      if (!title) {

        return res.status(400).json({

          success: false,

          message: "Title is required",
        });
      }


      // ================= CHECK DUPLICATE =================

      const existingCategory =
        await HealthPackageCategory.findOne({
          title: title.trim(),
        });

      if (existingCategory) {

        return res.status(400).json({

          success: false,

          message:
            "Category already exists",
        });
      }


      // ================= CREATE =================

      const category =
        await HealthPackageCategory.create({

          title: title.trim(),
        });


      res.status(201).json({

        success: true,

        message:
          "Health package category created successfully",

        data: category,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= GET ALL CATEGORIES =================

exports.getHealthPackageCategories =
  async (req, res) => {

    try {

      const categories =
        await HealthPackageCategory.find()

          .sort({ createdAt: -1 });


      res.status(200).json({

        success: true,

        count: categories.length,

        data: categories,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= GET SINGLE CATEGORY =================

exports.getHealthPackageCategoryById =
  async (req, res) => {

    try {

      const category =
        await HealthPackageCategory.findById(
          req.params.id
        );

      if (!category) {

        return res.status(404).json({

          success: false,

          message:
            "Category not found",
        });
      }


      res.status(200).json({

        success: true,

        data: category,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= UPDATE CATEGORY =================

exports.updateHealthPackageCategory =
  async (req, res) => {

    try {

      const { title } = req.body;


      const category =
        await HealthPackageCategory.findById(
          req.params.id
        );

      if (!category) {

        return res.status(404).json({

          success: false,

          message:
            "Category not found",
        });
      }


      // ================= CHECK DUPLICATE =================

      if (title) {

        const existingCategory =
          await HealthPackageCategory.findOne({

            title: title.trim(),

            _id: {
              $ne: req.params.id,
            },
          });

        if (existingCategory) {

          return res.status(400).json({

            success: false,

            message:
              "Category already exists",
          });
        }


        category.title =
          title.trim();
      }


      await category.save();


      res.status(200).json({

        success: true,

        message:
          "Category updated successfully",

        data: category,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= DELETE CATEGORY =================

exports.deleteHealthPackageCategory =
  async (req, res) => {

    try {

      const category =
        await HealthPackageCategory.findById(
          req.params.id
        );

      if (!category) {

        return res.status(404).json({

          success: false,

          message:
            "Category not found",
        });
      }


      await category.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Category deleted successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };