


const User =
  require("../models/userModel");

const jwt =
  require("jsonwebtoken");

const admin =
  require("../config/firebase");



/* =========================
   🔐 GENERATE JWT TOKEN
========================= */

const generateToken =
  (id) => {

    return jwt.sign(

      {
        id,
        role: "user",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

  };



/* =========================
   📝 REGISTER USER
========================= */
// =========================
// YE 2 LINES TOP PE ADD KARNI HAI
// (jaha User aur jwt require kiya hai wahin)
// =========================

// const Setting =
//   require("../models/settingModel");

// const walletService =
//   require("../services/walletService");


exports.registerUser =
  async (req, res) => {

    try {

      const {

        fullname,

        email,

        phone,

        password,

        confirmPassword,

        referralCode,

      } = req.body;

      // VALIDATION

      if (

        !fullname ||

        !email ||

        !phone ||

        !password ||

        !confirmPassword

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }

      // PASSWORD MATCH

      if (
        password !==
        confirmPassword
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Passwords do not match",

        });

      }

      // CHECK USER

      const userExists =
        await User.findOne({
          email,
        });

      if (userExists) {

        return res.status(400).json({

          success: false,

          message:
            "User already exists",

        });

      }

      // =========================
      // REFERRAL CODE CHECK
      // (AGAR USER NE DALA HAI TO)
      // =========================

      let referredByUser =
        null;

      if (referralCode) {

        referredByUser =
          await User.findOne({
            referralCode:
              referralCode.toUpperCase(),
          });

        // GALAT CODE HO TO
        // SIGNUP FIR BHI HONE DO
        // BAS REFERRAL SKIP KARDO

        if (!referredByUser) {

          console.log(
            "REFERRAL CODE INVALID:",
            referralCode
          );

        }

      }

      // CREATE USER

      const user =
        await User.create({

          fullname,

          email,

          phone,

          password,

          provider:
            "local",

          referredBy:
            referredByUser
              ? referredByUser._id
              : null,

        });

      // =========================
      // REFERRAL BONUS
      // REFER KARNE WALE KO CREDIT
      // (SIGNUP FAIL NAHI HOGA
      // AGAR YE STEP ERROR DE)
      // =========================

      if (referredByUser) {

        try {

          const settings =
            await Setting.getSettings();

          await walletService.creditWallet({
            userId:
              referredByUser._id,
            amount:
              settings.referralBonus,
            title:
              "Referral Bonus",
            subtitle:
              `${fullname} joined using your referral code`,
          });

          referredByUser.referralCount =
            (referredByUser.referralCount ||
              0) + 1;

          await referredByUser.save();

        } catch (referralError) {

          console.log(
            "REFERRAL BONUS ERROR:",
            referralError.message
          );

        }

      }

      // RESPONSE

      res.status(201).json({

        success: true,

        message:
          "User registered successfully",

        token:
          generateToken(
            user._id
          ),

        user,

      });

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   🔓 LOGIN USER
========================= */

exports.loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // VALIDATION

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password required",

        });

      }

      // FIND USER

      const user =
        await User.findOne({
          email,
        }).select("+password");

      if (!user) {

        return res.status(401).json({

          success: false,

          message:
            "User not found",

        });

      }

      // MATCH PASSWORD

      const isMatch =
        await user.matchPassword(
          password
        );

      if (!isMatch) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid password",

        });

      }

      // RESPONSE

      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token:
          generateToken(
            user._id
          ),

        user,

      });

    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



/* =========================
   🔵 GOOGLE LOGIN
========================= */

exports.googleLogin =
  async (req, res) => {

    try {

      const { token } =
        req.body;

      console.log(
        "TOKEN:",
        token
      );

      console.log(
        "TOKEN TYPE:",
        typeof token
      );

      // TOKEN CHECK

      if (!token) {

        return res.status(400).json({

          success: false,

          message:
            "Firebase token required",

        });

      }

      // VERIFY FIREBASE TOKEN

      const decodedToken =
        await admin
          .auth()
          .verifyIdToken(
            token
          );

      const {

        uid,

        name,

        email,

        picture,

      } = decodedToken;

      // FIND USER

      let user =
        await User.findOne({
          email,
        });

      // CREATE USER

      if (!user) {

        user =
          await User.create({

            fullname:
              name,

            email,

            // GOOGLE LOGIN
            // PHONE EMPTY

            phone: "",

            // GOOGLE LOGIN
            // PASSWORD EMPTY

            password: "",

            image:
              picture,

            googleId:
              uid,

            provider:
              "google",

          });

      }

      // GENERATE JWT

      const jwtToken =
        generateToken(
          user._id
        );

      // RESPONSE

      res.status(200).json({

        success: true,

        message:
          "Google login successful",

        token:
          jwtToken,

        user,

      });

    } catch (error) {

      console.log(
        "GOOGLE LOGIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Google login failed",

        error:
          error.message,

      });

    }

  };



/* =========================
   👤 GET USER PROFILE
========================= */

exports.getUserProfile =
  async (req, res) => {

    res.status(200).json({

      success: true,

      user:
        req.user,

    });

  };



/* =========================
   ✏️ UPDATE USER PROFILE
========================= */

exports.updateUserProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      user.fullname =
        req.body.fullname ||
        user.fullname;

      user.email =
        req.body.email ||
        user.email;

      user.phone =
        req.body.phone ||
        user.phone;

      // PASSWORD UPDATE

      if (
        req.body.password
      ) {

        user.password =
          req.body.password;

      }

      const updatedUser =
        await user.save();

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        user:
          updatedUser,

      });

    } catch (error) {

      console.log(
        "UPDATE ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// =====================================================
// GET MY REFERRAL DETAILS
// =====================================================

exports.getMyReferral = async (req, res) => {
  try {
    const Setting = require("../models/settingModel");

    // Logged-in user
    const user = await User.findById(req.user._id)
      .select("fullname email referralCode referralCount");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Admin settings
    const settings = await Setting.getSettings();

    const referrerBonus = settings.referralBonus || 0;
    const referredUserBonus =
      settings.referredUserBonus || 0;

    // Users referred by logged-in user
    const referredUsers = await User.find({
      referredBy: req.user._id,
    })
      .select(
        "_id fullname email phone createdAt"
      )
      .sort({
        createdAt: -1,
      });

    // Total amount earned by referrer
    const totalEarned =
      (user.referralCount || 0) *
      referrerBonus;

    // Referral users with reward information
    const referrals = referredUsers.map(
      (referredUser) => ({
        _id: referredUser._id,
        fullname: referredUser.fullname,
        email: referredUser.email,
        phone: referredUser.phone,
        joinedAt: referredUser.createdAt,

        referralReward: {
          referrer: {
            name: user.fullname,
            amount: referrerBonus,
          },

          referredUser: {
            name: referredUser.fullname,
            amount: referredUserBonus,
          },
        },
      })
    );

    res.status(200).json({
      success: true,

      message:
        "Referral details fetched successfully",

      data: {
        myReferralCode:
          user.referralCode,

        totalReferrals:
          user.referralCount || 0,

        totalEarned,

        referralReward: {
          referrerGets:
            referrerBonus,

          referredUserGets:
            referredUserBonus,
        },

        referredUsers: referrals,
      },
    });
  } catch (error) {
    console.log(
      "GET MY REFERRAL ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================
   🗑️ DELETE USER
========================= */

exports.deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      await user.deleteOne();

      res.status(200).json({

        success: true,

        message:
          "User deleted successfully",

      });

    } catch (error) {

      console.log(
        "DELETE ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   👑 GET ALL USERS
========================= */

exports.getAllUsers =
  async (req, res) => {

    try {

      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalUsers:
          users.length,

        users,

      });

    } catch (error) {

      console.log(
        "GET USERS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };
  /* =========================
   🔵 GET GOOGLE USERS
========================= */

exports.getGoogleUsers =
  async (req, res) => {

    try {

      const users =
        await User.find({

          provider:
            "google",

        }).select(
          "-password"
        );

      res.status(200).json({

        success: true,

        totalGoogleUsers:
          users.length,

        users,

      });

    } catch (error) {

      console.log(
        "GOOGLE USERS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };