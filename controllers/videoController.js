const { uploadToBunny } =
  require("../utils/bunnyUpload");

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video required",
      });
    }

    const bunnyFile =
      await uploadToBunny(req.file);

    res.status(200).json({
      success: true,
      file: bunnyFile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadVideo,
};