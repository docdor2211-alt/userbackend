const OnlineSymptom = require("../models/onlineSymptomModel");
const { uploadFile, deleteFile } = require("../utils/bunnyUpload");

// 🔥 SAME FUNCTION
const parseDoctors = (doctors) => {
  if (!doctors) return [];

  if (Array.isArray(doctors)) return doctors;

  if (typeof doctors === "string") {
    try {
      return JSON.parse(doctors);
    } catch {
      return [doctors];
    }
  }

  return [];
};


// ✅ CREATE
exports.createOnlineSymptom = async (req, res) => {
  try {
    const { name, color, doctors, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name required"
      });
    }

    let imageData = null;

    if (req.files?.image?.length > 0) {
      const uploadRes = await uploadFile(req.files.image[0]);
      imageData = {
        url: uploadRes.url,
        publicId: uploadRes.publicId
      };
    } else if (image?.url && image?.publicId) {
      imageData = image;
    }

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: "Image required"
      });
    }

    const data = await OnlineSymptom.create({
      name,
      color,
      doctors: parseDoctors(doctors),
      image: imageData
    });

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ GET ALL (PAGINATION)
// exports.getOnlineSymptoms = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const total = await OnlineSymptom.countDocuments();

//   const data = await OnlineSymptom.find()
//     .populate("doctors")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   res.json({
//     success: true,
//     page,
//     total,
//     totalPages: Math.ceil(total / limit),
//     data
//   });
// };
exports.getOnlineSymptoms = async (req, res) => {
  try {
    // 🔥 QUERY PARAMS
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // 🔥 SEARCH FILTER
    const query = {
      name: { $regex: search, $options: "i" }
    };

    // 🔥 TOTAL COUNT
    const total = await OnlineSymptom.countDocuments(query);

    // 🔥 DATA
    const data = await OnlineSymptom.find(query)
      .populate("doctors")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 🔥 META
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages,

      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,

      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,

      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ GET ONE
exports.getOnlineSymptomById = async (req, res) => {
  const data = await OnlineSymptom.findById(req.params.id).populate("doctors");

  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};


// ✅ UPDATE
exports.updateOnlineSymptom = async (req, res) => {
  const item = await OnlineSymptom.findById(req.params.id);

  if (!item) return res.status(404).json({ success: false });

  const { name, color, doctors, image } = req.body;

  if (name) item.name = name;
  if (color) item.color = color;

  if (doctors) {
    item.doctors = parseDoctors(doctors);
  }

  if (req.files?.image?.length > 0) {
    if (item.image?.publicId) {
      await deleteFile(item.image.publicId);
    }

    const uploadRes = await uploadFile(req.files.image[0]);

    item.image = {
      url: uploadRes.url,
      publicId: uploadRes.publicId
    };
  }

  else if (image?.url && image?.publicId) {
    if (item.image?.publicId) {
      await deleteFile(item.image.publicId);
    }
    item.image = image;
  }

  await item.save();

  res.json({ success: true, data: item });
};


// ✅ DELETE
exports.deleteOnlineSymptom = async (req, res) => {
  const item = await OnlineSymptom.findById(req.params.id);

  if (!item) return res.status(404).json({ success: false });

  if (item.image?.publicId) {
    await deleteFile(item.image.publicId);
  }

  await item.deleteOne();

  res.json({ success: true });
};