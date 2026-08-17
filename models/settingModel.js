const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
    {
        // =========================
        // REFERRAL SYSTEM
        // =========================

        // REFER KARNE WALE USER KO
        // KITNA BONUS MILEGA (RS)

        referralBonus: {
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
    }
);

// =========================
// GET SETTINGS
// (SIRF EK HI DOCUMENT REHTA HAI
// POORI APP KE LIYE, NAHI HO TO
// KHUD BANA DEGA DEFAULT VALUES SE)
// =========================

settingSchema.statics.getSettings = async function () {
    let settings = await this.findOne();

    if (!settings) {
        settings = await this.create({});
    }

    return settings;
};

module.exports = mongoose.model("Setting", settingSchema);