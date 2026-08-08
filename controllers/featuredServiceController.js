// controllers/featuredServiceController.js

const FeaturedService = require(
  "../models/featuredServiceModel"
);

const {
  uploadFile,
  deleteFile,
} = require("../utils/bunnyUpload");



// ================= CREATE =================

exports.createFeaturedService = async (
  req,
  res
) => {

  try {

    const {

      title,

      subtitle,

      headerText,

      badgeText,

      iconText,

      benefits,

      timeSlots,

      price,
      doctorId,

      themeColor,

      gradient,

      isActive,

      serviceDate,

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



    // ================= ARRAY HANDLE =================

    let parsedBenefits = [];

    if (benefits) {

      parsedBenefits =
        typeof benefits === "string"
          ? JSON.parse(benefits)
          : benefits;
    }


    let parsedTimeSlots = [];

    if (timeSlots) {

      parsedTimeSlots =
        typeof timeSlots === "string"
          ? JSON.parse(timeSlots)
          : timeSlots;
    }


    let parsedGradient = [];

    if (gradient) {

      parsedGradient =
        typeof gradient === "string"
          ? JSON.parse(gradient)
          : gradient;
    }



    // ================= CREATE =================

    const data =
      await FeaturedService.create({

        title,

        subtitle,

        headerText,

        badgeText,

        iconText,

        benefits: parsedBenefits,

        timeSlots: parsedTimeSlots,

        price,
        doctorId,

        themeColor,

        gradient: parsedGradient,

        isActive,

        serviceDate,

        image: imageData,
      });



    res.status(201).json({

      success: true,

      message:
        "Featured service created successfully",

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



// ================= GET ALL =================

exports.getFeaturedServices = async (
  req,
  res
) => {

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


    // const data =
    //   await FeaturedService.find(filter)

    //     .sort({ createdAt: -1 });
    const data =
  await FeaturedService.find(filter)

    .populate(
      "doctorId",
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



// ================= GET SINGLE =================

exports.getFeaturedServiceById =
  async (req, res) => {

    try {

      const item =
  await FeaturedService.findById(
    req.params.id
  ).populate(
    "doctorId",
    "name speciality degree experience fees image rating reviews"
  );

      if (!item) {

        return res.status(404).json({

          success: false,

          message:
            "Featured service not found",
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



// ================= UPDATE =================

exports.updateFeaturedService =
  async (req, res) => {

    try {

      const item =
        await FeaturedService.findById(
          req.params.id
        );

      if (!item) {

        return res.status(404).json({

          success: false,

          message:
            "Featured service not found",
        });
      }


      const {

        title,

        subtitle,

        headerText,

        badgeText,

        iconText,

        benefits,

        timeSlots,

        price,
        doctorId,

        themeColor,

        gradient,

        isActive,

        serviceDate,

      } = req.body;



      // ================= UPDATE FIELDS =================

      item.title =
        title || item.title;

      item.subtitle =
        subtitle || item.subtitle;

      item.headerText =
        headerText || item.headerText;

      item.badgeText =
        badgeText || item.badgeText;

      item.iconText =
        iconText || item.iconText;

      item.price =
        price || item.price;
        item.doctorId =
  doctorId || item.doctorId;

      item.themeColor =
        themeColor || item.themeColor;

      item.serviceDate =
        serviceDate || item.serviceDate;



      // ================= ARRAY HANDLE =================

      if (benefits) {

        item.benefits =
          typeof benefits === "string"
            ? JSON.parse(benefits)
            : benefits;
      }


      if (timeSlots) {

        item.timeSlots =
          typeof timeSlots === "string"
            ? JSON.parse(timeSlots)
            : timeSlots;
      }


      if (gradient) {

        item.gradient =
          typeof gradient === "string"
            ? JSON.parse(gradient)
            : gradient;
      }



      // ================= BOOLEAN =================

      if (
        typeof isActive !==
        "undefined"
      ) {

        item.isActive = isActive;
      }



      // ================= IMAGE UPDATE =================

      if (req.files?.image?.[0]) {

        // DELETE OLD IMAGE

        if (item.image?.publicId) {

          await deleteFile(
            item.image.publicId
          );
        }


        const uploaded =
          await uploadFile(
            req.files.image[0]
          );

        item.image = {

          url: uploaded.url,

          publicId:
            uploaded.publicId,
        };
      }



      await item.save();


      res.json({

        success: true,

        message:
          "Featured service updated successfully",

        data: item,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= DELETE =================

exports.deleteFeaturedService =
  async (req, res) => {

    try {

      const item =
        await FeaturedService.findById(
          req.params.id
        );

      if (!item) {

        return res.status(404).json({

          success: false,

          message:
            "Featured service not found",
        });
      }


      // ================= DELETE IMAGE =================

      if (item.image?.publicId) {

        await deleteFile(
          item.image.publicId
        );
      }


      await item.deleteOne();


      res.json({

        success: true,

        message:
          "Featured service deleted successfully",
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };