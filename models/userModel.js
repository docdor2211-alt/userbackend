
const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");

const userSchema =
  new mongoose.Schema(
    {

      fullname: {
        type: String,
        required: [
          true,
          "User fullname is required",
        ],
      },

      email: {
        type: String,
        required: [
          true,
          "Email is required",
        ],
        unique: true,
        lowercase: true,
      },

      // GOOGLE LOGIN ME
      // PHONE EMPTY HO SAKTA


phone: {
  type: String,
  default: "",
},

password: {
  type: String,
  default: "",
  select: false,
},



      // GOOGLE IMAGE

      image: {
        type: String,
        default: "",
      },

      // GOOGLE UID

      googleId: {
        type: String,
        default: "",
      },

      // LOGIN TYPE

      provider: {
        type: String,
        enum: [
          "local",
          "google",
        ],
        default: "local",
      },

      role: {
        type: String,
        default: "user",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

    },
    {
      timestamps: true,
    }
  );



// =========================
// HASH PASSWORD
// =========================

userSchema.pre(
  "save",
  async function () {

    // PASSWORD CHANGE NAHI

    if (
      !this.isModified(
        "password"
      )
    )
      return;

    // GOOGLE LOGIN
    // PASSWORD EMPTY

    if (!this.password)
      return;

    // HASH PASSWORD

    this.password =
      await bcrypt.hash(
        this.password,
        10
      );

  }
);



// =========================
// MATCH PASSWORD
// =========================

userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );

  };



module.exports =
  mongoose.model(
    "User",
    userSchema
  );

