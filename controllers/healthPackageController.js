// controllers/healthPackageController.js

const HealthPackage = require(
  "../models/healthPackageModel"
);

const HealthPackageCategory = require(
  "../models/healthPackageCategoryModel"
);



// ================= CREATE HEALTH PACKAGE =================

exports.createHealthPackage =
  async (req, res) => {

    try {

      const {

        title,

        subtitle,

        testCount,

        includedTests,

        originalPrice,

        currentPrice,

        tag,

        category,

        isActive,

      } = req.body;



      // ================= VALIDATION =================

      if (
        !title ||
        !testCount ||
        !originalPrice ||
        !currentPrice ||
        !category
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields",
        });
      }



      // ================= CHECK CATEGORY =================

      const categoryExists =
        await HealthPackageCategory.findById(
          category
        );

      if (!categoryExists) {

        return res.status(404).json({

          success: false,

          message:
            "Category not found",
        });
      }



      // ================= HANDLE INCLUDED TESTS =================

      let parsedIncludedTests = [];

      if (includedTests) {

        parsedIncludedTests =
          typeof includedTests === "string"
            ? JSON.parse(includedTests)
            : includedTests;
      }



      // ================= CREATE =================

      const healthPackage =
        await HealthPackage.create({

          title,

          subtitle,

          testCount,

          includedTests:
            parsedIncludedTests,

          originalPrice,

          currentPrice,

          tag,

          category,

          isActive,
        });



      res.status(201).json({

        success: true,

        message:
          "Health package created successfully",

        data: healthPackage,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= GET ALL HEALTH PACKAGES =================

exports.getHealthPackages =
  async (req, res) => {

    try {

      let filter = {};



      // ================= ACTIVE FILTER =================

      if (
        typeof req.query.isActive !==
        "undefined"
      ) {

        filter.isActive =
          req.query.isActive === "true";
      }



      // ================= CATEGORY FILTER =================

      if (req.query.category) {

        filter.category =
          req.query.category;
      }



      const healthPackages =
        await HealthPackage.find(filter)

          .populate(
            "category",
            "title"
          )

          .sort({
            createdAt: -1,
          });



      res.status(200).json({

        success: true,

        count: healthPackages.length,

        data: healthPackages,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= GET SINGLE HEALTH PACKAGE =================

exports.getHealthPackageById =
  async (req, res) => {

    try {

      const healthPackage =
        await HealthPackage.findById(
          req.params.id
        ).populate(
          "category",
          "title"
        );



      if (!healthPackage) {

        return res.status(404).json({

          success: false,

          message:
            "Health package not found",
        });
      }



      res.status(200).json({

        success: true,

        data: healthPackage,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= UPDATE HEALTH PACKAGE =================

exports.updateHealthPackage =
  async (req, res) => {

    try {

      const healthPackage =
        await HealthPackage.findById(
          req.params.id
        );



      if (!healthPackage) {

        return res.status(404).json({

          success: false,

          message:
            "Health package not found",
        });
      }



      const {

        title,

        subtitle,

        testCount,

        includedTests,

        originalPrice,

        currentPrice,

        tag,

        category,

        isActive,

      } = req.body;



      // ================= CHECK CATEGORY =================

      if (category) {

        const categoryExists =
          await HealthPackageCategory.findById(
            category
          );

        if (!categoryExists) {

          return res.status(404).json({

            success: false,

            message:
              "Category not found",
          });
        }

        healthPackage.category =
          category;
      }



      // ================= UPDATE FIELDS =================

      healthPackage.title =
        title || healthPackage.title;

      healthPackage.subtitle =
        subtitle ||
        healthPackage.subtitle;

      healthPackage.testCount =
        testCount ||
        healthPackage.testCount;

      healthPackage.originalPrice =
        originalPrice ||
        healthPackage.originalPrice;

      healthPackage.currentPrice =
        currentPrice ||
        healthPackage.currentPrice;

      healthPackage.tag =
        tag || healthPackage.tag;



      // ================= INCLUDED TESTS =================

      if (includedTests) {

        healthPackage.includedTests =
          typeof includedTests ===
          "string"
            ? JSON.parse(
                includedTests
              )
            : includedTests;
      }



      // ================= STATUS =================

      if (
        typeof isActive !==
        "undefined"
      ) {

        healthPackage.isActive =
          isActive;
      }



      await healthPackage.save();



      res.status(200).json({

        success: true,

        message:
          "Health package updated successfully",

        data: healthPackage,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= DELETE HEALTH PACKAGE =================

exports.deleteHealthPackage =
  async (req, res) => {

    try {

      const healthPackage =
        await HealthPackage.findById(
          req.params.id
        );



      if (!healthPackage) {

        return res.status(404).json({

          success: false,

          message:
            "Health package not found",
        });
      }



      await healthPackage.deleteOne();



      res.status(200).json({

        success: true,

        message:
          "Health package deleted successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };