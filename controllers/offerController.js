// controllers/offerController.js

const Offer = require("../models/offerModel");

const {
  uploadFile,
  deleteFile,
} = require("../utils/bunnyUpload");



// ================= CREATE OFFER =================

exports.createOffer = async (req, res) => {

  try {

    const {
      title,
      tagline,
      desc,
      discount,
      specialty,
      doctorIds,
      isActive,
    } = req.body;


    let imageData = {};

    // IMAGE UPLOAD
    if (req.files?.image?.[0]) {

      const uploaded = await uploadFile(
        req.files.image[0]
      );

      imageData = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }


    const data = await Offer.create({

      title,

      tagline,

      desc,

      discount,

      specialty,
     doctorIds,

      isActive,

      image: imageData,
    });


    res.status(201).json({

      success: true,

      message: "Offer created successfully",

      data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= GET ALL OFFERS =================

exports.getOffers = async (req, res) => {

  try {

    let filter = {};

    // ACTIVE FILTER
    if (req.query.isActive) {

      filter.isActive =
        req.query.isActive === "true";
    }

    // SPECIALTY FILTER
    if (req.query.specialty) {

      filter.specialty =
        req.query.specialty;
    }


  const data = await Offer.find(filter)

  .populate(
  "doctorIds",
  "name speciality degree experience fees image rating reviews"
)

  .sort({ createdAt: -1 });


    res.json({

      success: true,

      count: data.length,

      data,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= GET SINGLE OFFER =================

exports.getOfferById = async (req, res) => {

  try {

    const item = await Offer.findById(
  req.params.id
).populate(
  "doctorIds",
  "name speciality degree experience fees image rating reviews"
);

    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Offer not found",
      });
    }

    res.json({

      success: true,

      data: item,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= UPDATE OFFER =================

exports.updateOffer = async (req, res) => {

  try {

    const item = await Offer.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Offer not found",
      });
    }


    const {
      title,
      tagline,
      desc,
      discount,
      specialty,
      doctorIds,
      isActive,
    } = req.body;


    item.title =
      title || item.title;

    item.tagline =
      tagline || item.tagline;

    item.desc =
      desc || item.desc;

    item.discount =
      discount || item.discount;

    item.specialty =
      specialty || item.specialty;
     item.doctorIds =
  doctorIds || item.doctorIds;

    // BOOLEAN HANDLE
    if (typeof isActive !== "undefined") {

      item.isActive = isActive;
    }


    // IMAGE UPDATE
    if (req.files?.image?.[0]) {

      // DELETE OLD IMAGE
      if (item.image?.publicId) {

        await deleteFile(
          item.image.publicId
        );
      }

      const uploaded = await uploadFile(
        req.files.image[0]
      );

      item.image = {

        url: uploaded.url,

        publicId: uploaded.publicId,
      };
    }


    await item.save();


    res.json({

      success: true,

      message: "Offer updated successfully",

      data: item,
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};



// ================= DELETE OFFER =================

exports.deleteOffer = async (req, res) => {

  try {

    const item = await Offer.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({

        success: false,

        message: "Offer not found",
      });
    }


    // DELETE IMAGE
    if (item.image?.publicId) {

      await deleteFile(
        item.image.publicId
      );
    }


    await item.deleteOne();


    res.json({

      success: true,

      message: "Offer deleted successfully",
    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,
    });
  }
};