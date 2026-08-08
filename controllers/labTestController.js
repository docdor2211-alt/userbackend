
const LabTest = require("../models/LabTestModel");

const {
  uploadFile,
  deleteFile,
} = require("../utils/bunnyUpload");



// ================= CREATE =================

exports.createLabTest = async (req, res) => {

  try {

    const {
      title,
      shortDescription,
      description,

      category,

      checkupType,

      actualPrice,
      salePrice,

      reportTime,
      totalTests,

      recommended,
      bestSeller,

      homeSample,
      digitalReport,
      nablCertified,

      guidelines,
      parameters,

    } = req.body;


    // ================= IMAGE =================

    let imageData = {};

    if (req.files?.image?.[0]) {

      const uploaded = await uploadFile(
        req.files.image[0]
      );

      imageData = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }


    // ================= CREATE =================

    const data = await LabTest.create({

      title,

      shortDescription,

      description,

      category,

      checkupType,

      actualPrice,

      salePrice,

      reportTime,

      totalTests,

      recommended,

      bestSeller,

      homeSample,

      digitalReport,

      nablCertified,

      // ✅ FIX: FormData se string aati hai, parse karke array banao
      guidelines: guidelines ? JSON.parse(guidelines) : [],

      parameters: parameters ? JSON.parse(parameters) : [],

      image: imageData,
    });


    res.status(201).json({

      success: true,

      message: "Lab Test created successfully",

      data,
    });

  } catch (err) {

    console.log("CREATE ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= GET ALL =================

exports.getLabTests = async (req, res) => {

  try {

    let filter = {};


    // ================= RECOMMENDED =================

    if (req.query.recommended) {

      filter.recommended =
        req.query.recommended === "true";
    }


    // ================= CATEGORY =================

    if (req.query.category) {

      filter.category =
        req.query.category;
    }


    // ================= CHECKUP TYPE =================

    if (req.query.checkupType) {

      filter.checkupType =
        req.query.checkupType;
    }


    // ================= GET DATA =================

    const data = await LabTest.find(filter)

      .populate("category")
      .populate("checkupType")

      .sort({ createdAt: -1 });


    res.status(200).json({

      success: true,

      count: data.length,

      data,
    });

  } catch (err) {

    console.log("GET ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= GET SINGLE =================

exports.getLabTestById = async (req, res) => {

  try {

    const item = await LabTest.findById(
      req.params.id
    )

      .populate("category")
      .populate("checkupType");


    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Lab Test not found",
      });
    }


    res.status(200).json({

      success: true,

      data: item,
    });

  } catch (err) {

    console.log("GET SINGLE ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= UPDATE =================

exports.updateLabTest = async (req, res) => {

  try {

    const item = await LabTest.findById(
      req.params.id
    );


    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Lab Test not found",
      });
    }


    const {
      title,
      shortDescription,
      description,

      category,

      checkupType,

      actualPrice,
      salePrice,

      reportTime,
      totalTests,

      recommended,
      bestSeller,

      homeSample,
      digitalReport,
      nablCertified,

      guidelines,
      parameters,

    } = req.body;


    // ================= UPDATE FIELDS =================

    item.title =
      title || item.title;

    item.shortDescription =
      shortDescription || item.shortDescription;

    item.description =
      description || item.description;

    item.category =
      category || item.category;

    item.checkupType =
      checkupType || item.checkupType;

    item.actualPrice =
      actualPrice || item.actualPrice;

    item.salePrice =
      salePrice || item.salePrice;

    item.reportTime =
      reportTime || item.reportTime;

    item.totalTests =
      totalTests || item.totalTests;

    item.recommended =
      recommended ?? item.recommended;

    item.bestSeller =
      bestSeller ?? item.bestSeller;

    item.homeSample =
      homeSample ?? item.homeSample;

    item.digitalReport =
      digitalReport ?? item.digitalReport;

    item.nablCertified =
      nablCertified ?? item.nablCertified;

    // ✅ FIX: FormData se string aati hai, parse karke array banao
    item.guidelines =
      guidelines ? JSON.parse(guidelines) : item.guidelines;

    item.parameters =
      parameters ? JSON.parse(parameters) : item.parameters;


    // ================= IMAGE UPDATE =================

    if (req.files?.image?.[0]) {

      // DELETE OLD IMAGE
      if (item.image?.publicId) {

        await deleteFile(
          item.image.publicId
        );
      }


      // UPLOAD NEW IMAGE
      const uploaded = await uploadFile(
        req.files.image[0]
      );

      item.image = {

        url: uploaded.url,

        publicId: uploaded.publicId,
      };
    }


    await item.save();


    res.status(200).json({

      success: true,

      message: "Lab Test updated successfully",

      data: item,
    });

  } catch (err) {

    console.log("UPDATE ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= DELETE =================

exports.deleteLabTest = async (req, res) => {

  try {

    const item = await LabTest.findById(
      req.params.id
    );


    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Lab Test not found",
      });
    }


    // ================= DELETE IMAGE =================

    if (item.image?.publicId) {

      await deleteFile(
        item.image.publicId
      );
    }


    // ================= DELETE DATA =================

    await item.deleteOne();


    res.status(200).json({

      success: true,

      message: "Lab Test deleted successfully",
    });

  } catch (err) {

    console.log("DELETE ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};