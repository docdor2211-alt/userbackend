// const CheckupType = require("../models/CheckupTypeModel");

// const {
//   uploadFile,
// } = require("../utils/bunnyUpload");


// // ================= CREATE =================

// exports.createCheckupType = async (req, res) => {

//   try {

//     const {
//       title,
//       slug,
//     } = req.body;


//     let imageData = {};

//     // IMAGE
//     if (req.files?.image?.[0]) {

//       const uploaded = await uploadFile(
//         req.files.image[0]
//       );

//       imageData = {
//         url: uploaded.url,
//         publicId: uploaded.publicId,
//       };
//     }


//     const data = await CheckupType.create({

//       title,

//       slug,

//       image: imageData,
//     });


//     res.status(201).json({
//       success: true,
//       data,
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// // ================= GET ALL =================

// exports.getCheckupTypes = async (req, res) => {

//   try {

//     const data = await CheckupType.find()
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data,
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const CheckupType = require("../models/CheckupTypeModel");

const {
  uploadFile,
  deleteFile,
} = require("../utils/bunnyUpload");



// ================= CREATE =================

exports.createCheckupType = async (req, res) => {

  try {

    const {
      title,
      slug,
    } = req.body;


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


    const data = await CheckupType.create({

      title,

      slug,

      image: imageData,
    });


    res.status(201).json({
      success: true,
      message: "Checkup Type created successfully",
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

exports.getCheckupTypes = async (req, res) => {

  try {

    const data = await CheckupType.find()
      .sort({ createdAt: -1 });

    res.json({
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

exports.getCheckupTypeById = async (req, res) => {

  try {

    const item = await CheckupType.findById(req.params.id);

    if (!item) {

      return res.status(404).json({
        success: false,
        message: "Checkup Type not found",
      });
    }

    res.json({
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

exports.updateCheckupType = async (req, res) => {

  try {

    const item = await CheckupType.findById(req.params.id);

    if (!item) {

      return res.status(404).json({
        success: false,
        message: "Checkup Type not found",
      });
    }

    const { title, slug } = req.body;


    // ================= UPDATE FIELDS =================

    item.title = title || item.title;

    item.slug  = slug  || item.slug;


    // ================= IMAGE UPDATE =================

    if (req.files?.image?.[0]) {

      // DELETE OLD IMAGE
      if (item.image?.publicId) {
        await deleteFile(item.image.publicId);
      }

      // UPLOAD NEW IMAGE
      const uploaded = await uploadFile(req.files.image[0]);

      item.image = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }


    await item.save();


    res.json({
      success: true,
      message: "Checkup Type updated successfully",
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

exports.deleteCheckupType = async (req, res) => {

  try {

    const item = await CheckupType.findById(req.params.id);

    if (!item) {

      return res.status(404).json({
        success: false,
        message: "Checkup Type not found",
      });
    }


    // DELETE IMAGE
    if (item.image?.publicId) {
      await deleteFile(item.image.publicId);
    }


    await item.deleteOne();


    res.json({
      success: true,
      message: "Checkup Type deleted successfully",
    });

  } catch (err) {

    console.log("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};