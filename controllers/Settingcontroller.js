const Setting = require("../models/settingModel");
const walletService = require("../services/walletService");



/* =========================
   ⚙️ GET SETTINGS
========================= */

exports.getSettings =
    async (req, res) => {

        try {

            const settings =
                await Setting.getSettings();

            res.status(200).json({

                success: true,

                settings,

            });

        } catch (error) {

            console.log(
                "GET SETTINGS ERROR:",
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
   ⚙️ UPDATE SETTINGS
   (ADMIN ONLY)
========================= */

exports.updateSettings =
    async (req, res) => {

        try {

            const {

                referralBonus,

            } = req.body;

            const settings =
                await Setting.getSettings();

            // SIRF JO VALUE AAYI HAI
            // WAHI UPDATE HOGI

            if (
                referralBonus !==
                undefined
            ) {

                settings.referralBonus =
                    referralBonus;

            }

            await settings.save();

            res.status(200).json({

                success: true,

                message:
                    "Settings updated successfully",

                settings,

            });

        } catch (error) {

            console.log(
                "UPDATE SETTINGS ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    };
