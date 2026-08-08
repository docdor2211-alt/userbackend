const Doctor = require("../models/doctorModel");

// =====================================================
// ================= CREATE DOCTOR =====================
// =====================================================

exports.createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      degree,
      qualification,
      speciality,
      experience,
      fees,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    // ================= VALIDATION =================

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Doctor name is required",
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location (latitude & longitude) is required",
      });
    }

    // ================= CHECK FOR DUPLICATE EMAIL =================

    if (email) {
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: "Doctor with this email already exists",
        });
      }
    }

    // ================= CREATE DOCTOR OBJECT =================

    const doctorData = {
      name,
      email: email || "",
      phoneNumber: phoneNumber || "",
      degree: degree || "",
      qualification: qualification || "",
      speciality: speciality || "",
      experience: experience || "",
      fees: fees || 0,
      address: address || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      isApproved: false,
      isBlocked: false,
      isActive: true,
    };

    // ================= HANDLE IMAGE =================

    if (req.file) {
      doctorData.image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    // ================= SAVE TO DATABASE =================

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= GET ALL DOCTORS ===================
// =====================================================

exports.getDoctors = async (req, res) => {
  try {
    const { search, speciality, isApproved, isBlocked } = req.query;
    
    let query = {};

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by speciality
    if (speciality) {
      query.speciality = speciality;
    }

    // Filter by approval status
    if (isApproved === "true") {
      query.isApproved = true;
    } else if (isApproved === "false") {
      query.isApproved = false;
    }

    // Filter by block status
    if (isBlocked === "true") {
      query.isBlocked = true;
    } else if (isBlocked === "false") {
      query.isBlocked = false;
    }

    const doctors = await Doctor.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= GET SINGLE DOCTOR =================
// =====================================================

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= UPDATE DOCTOR =====================
// =====================================================

exports.updateDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      degree,
      qualification,
      speciality,
      experience,
      fees,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ================= CHECK DUPLICATE EMAIL =================

    if (email && email !== doctor.email) {
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: "Doctor with this email already exists",
        });
      }
    }

    // ================= UPDATE FIELDS =================

    if (name !== undefined) doctor.name = name;
    if (email !== undefined) doctor.email = email;
    if (phoneNumber !== undefined) doctor.phoneNumber = phoneNumber;
    if (degree !== undefined) doctor.degree = degree;
    if (qualification !== undefined) doctor.qualification = qualification;
    if (speciality !== undefined) doctor.speciality = speciality;
    if (experience !== undefined) doctor.experience = experience;
    if (fees !== undefined) doctor.fees = fees;
    if (address !== undefined) doctor.address = address;
    if (city !== undefined) doctor.city = city;
    if (state !== undefined) doctor.state = state;
    if (pincode !== undefined) doctor.pincode = pincode;

    // ================= LOCATION =================

    if (latitude && longitude) {
      doctor.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // ================= IMAGE =================

    if (req.file) {
      doctor.image.url = `/uploads/${req.file.filename}`;
      doctor.image.publicId = req.file.filename;
    }

    // ================= SAVE =================

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= DELETE DOCTOR =====================
// =====================================================

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= APPROVE DOCTOR ====================
// =====================================================

exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isApproved = true;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= BLOCK / UNBLOCK ===================
// =====================================================

exports.blockDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isBlocked = !doctor.isBlocked;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: doctor.isBlocked
        ? "Doctor blocked successfully"
        : "Doctor unblocked successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= BULK DELETE =======================
// =====================================================

exports.bulkDeleteDoctors = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of doctor IDs",
      });
    }

    const result = await Doctor.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} doctors deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ================= GET STATISTICS ====================
// =====================================================

exports.getStatistics = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const approvedDoctors = await Doctor.countDocuments({ isApproved: true });
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
    const blockedDoctors = await Doctor.countDocuments({ isBlocked: true });
    
    const feesResult = await Doctor.aggregate([
      {
        $group: {
          _id: null,
          avgFees: { $avg: "$fees" },
          minFees: { $min: "$fees" },
          maxFees: { $max: "$fees" }
        }
      }
    ]);

    const specialityStats = await Doctor.aggregate([
      {
        $group: {
          _id: "$speciality",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        approvedDoctors,
        pendingDoctors,
        blockedDoctors,
        fees: feesResult[0] || { avgFees: 0, minFees: 0, maxFees: 0 },
        topSpecialities: specialityStats
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};