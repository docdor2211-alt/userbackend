const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");

const crypto =
  require("crypto");

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

      // =========================
      // REFERRAL SYSTEM
      // =========================

      // ISS USER KA APNA CODE
      // JISE YE DUSRO KO SHARE KAREGA

      referralCode: {
        type: String,
        unique: true,
      },

      // KISNE ISKO REFER KIYA
      // (NULL AGAR DIRECT SIGNUP)

      referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      // KITNE LOGO KO
      // ISNE REFER KIYA HAI

      referralCount: {
        type: Number,
        default: 0,
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
    ) {

      // PASSWORD SKIP HO GAYA
      // AB REFERRAL CODE CHECK KARO

    } else if (this.password) {

      // HASH PASSWORD

      this.password =
        await bcrypt.hash(
          this.password,
          10
        );

    }

    // =========================
    // AUTO GENERATE REFERRAL CODE
    // (SIRF NAYE USER PE)
    // =========================

    if (
      !this.referralCode
    ) {

      this.referralCode =
        await generateUniqueReferralCode(
          this.fullname
        );

    }

  }
);



// =========================
// GENERATE UNIQUE REFERRAL CODE
// =========================

async function generateUniqueReferralCode(
  fullname
) {

  const namePart =
    (fullname || "USER")
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 4) || "USER";

  let code;

  let exists = true;

  // JAB TAK UNIQUE CODE NA MILE

  while (exists) {

    const randomPart =
      crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    code =
      namePart +
      randomPart;

    exists =
      await mongoose
        .model("User")
        .exists({
          referralCode: code,
        });

  }

  return code;

}



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