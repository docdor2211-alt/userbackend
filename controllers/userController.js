


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

exports.registerUser =
  async (req, res) => {

    try {

      const {

        fullname,

        email,

        phone,

        password,

        confirmPassword,

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

      // CREATE USER

      const user =
        await User.create({

          fullname,

          email,

          phone,

          password,

          provider:
            "local",

        });

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