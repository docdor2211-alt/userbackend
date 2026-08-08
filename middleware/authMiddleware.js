// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const Admin = require("../models/adminModel");

// /* =========================
//    🔒 PROTECT (Common)
// ========================= */
// exports.protect = async (req, res, next) => {
//   try {
//     let token;

//     // token get
//     if (req.headers.authorization?.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, token missing",
//       });
//     }

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 🔥 CHECK ADMIN FIRST
//     let user = await Admin.findById(decoded.id).select("-password");

//     if (!user) {
//       // 👉 if not admin, check user
//       user = await User.findById(decoded.id).select("-password");
//     }

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User/Admin not found",
//       });
//     }

//     req.user = user;
//     next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };



// /* =========================
//    👤 USER ONLY
// ========================= */
// exports.userOnly = (req, res, next) => {
//   if (req.user.role !== "user") {
//     return res.status(403).json({
//       success: false,
//       message: "User access only",
//     });
//   }
//   next();
// };



// /* =========================
//    👑 ADMIN ONLY
// ========================= */
// exports.adminOnly = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       success: false,
//       message: "Admin access only",
//     });
//   }
//   next();
// };


// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Admin = require("../models/adminModel");


/* =========================
   🔒 PROTECT MIDDLEWARE
========================= */

exports.protect = async (req, res, next) => {

  try {

    let token;

    // =========================
    // GET TOKEN
    // =========================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

    }

    // =========================
    // TOKEN NOT FOUND
    // =========================

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });

    }

    // =========================
    // VERIFY TOKEN
    // =========================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =========================
    // CHECK ADMIN
    // =========================

    let admin = await Admin.findById(decoded.id)
      .select("-password");

    if (admin) {

      req.user = {
        ...admin._doc,
        role: "admin",
      };

      return next();

    }

    // =========================
    // CHECK USER
    // =========================

    let user = await User.findById(decoded.id)
      .select("-password");

    if (user) {

      req.user = {
        ...user._doc,
        role: "user",
      };

      return next();

    }

    // =========================
    // USER NOT FOUND
    // =========================

    return res.status(401).json({
      success: false,
      message: "User/Admin not found",
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });

  }

};



/* =========================
   👤 USER ONLY
========================= */

exports.userOnly = (req, res, next) => {

  if (req.user.role !== "user") {

    return res.status(403).json({
      success: false,
      message: "User access only",
    });

  }

  next();

};



/* =========================
   👑 ADMIN ONLY
========================= */

exports.adminOnly = (req, res, next) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });

  }

  next();

};