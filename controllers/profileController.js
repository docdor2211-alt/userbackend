// controllers/profileController.js

const Profile = require(
  "../models/profileModel"
);

const {
  uploadFile,
  deleteFile,
} = require(
  "../utils/bunnyUpload"
);



// ================= CREATE PROFILE =================

exports.createProfile =
  async (req, res) => {

    try {

      const {

        name,

        gender,

        age,

        height,

        weight,

        bloodGroup,

        familyMembers,

        isActive,

      } = req.body;



      // ================= VALIDATION =================

      if (!name) {

        return res.status(400).json({

          success: false,

          message:
            "Name is required",
        });
      }



      // ================= FAMILY MEMBERS =================

      let parsedFamilyMembers = [];

      if (familyMembers) {

        parsedFamilyMembers =
          typeof familyMembers ===
          "string"
            ? JSON.parse(
                familyMembers
              )
            : familyMembers;
      }



      // ================= PROFILE IMAGE =================

      let profileImageData = {

        url: "",

        publicId: "",
      };



      if (
        req.files?.profileImage?.[0]
      ) {

        const uploaded =
          await uploadFile(
            req.files
              .profileImage[0]
          );

        profileImageData = {

          url: uploaded.url,

          publicId:
            uploaded.publicId,
        };
      }



      // ================= CREATE PROFILE =================

      const profile =
        await Profile.create({

          name,

          gender,

          age,

          height,

          weight,

          bloodGroup,

          familyMembers:
            parsedFamilyMembers,

          profileImage:
            profileImageData,

          isActive,
        });



      res.status(201).json({

        success: true,

        message:
          "Profile created successfully",

        data: profile,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= GET ALL PROFILES =================

exports.getProfiles =
  async (req, res) => {

    try {

      let filter = {};



      // ================= ACTIVE FILTER =================

      if (
        typeof req.query.isActive !==
        "undefined"
      ) {

        filter.isActive =
          req.query.isActive ===
          "true";
      }



      const profiles =
        await Profile.find(filter)

          .sort({
            createdAt: -1,
          });



      res.status(200).json({

        success: true,

        count:
          profiles.length,

        data: profiles,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= GET SINGLE PROFILE =================

exports.getProfileById =
  async (req, res) => {

    try {

      const profile =
        await Profile.findById(
          req.params.id
        );



      if (!profile) {

        return res.status(404).json({

          success: false,

          message:
            "Profile not found",
        });
      }



      res.status(200).json({

        success: true,

        data: profile,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= UPDATE PROFILE =================

exports.updateProfile =
  async (req, res) => {

    try {

      const profile =
        await Profile.findById(
          req.params.id
        );



      if (!profile) {

        return res.status(404).json({

          success: false,

          message:
            "Profile not found",
        });
      }



      const {

        name,

        gender,

        age,

        height,

        weight,

        bloodGroup,

        familyMembers,

        isActive,

      } = req.body;



      // ================= UPDATE FIELDS =================

      profile.name =
        name || profile.name;

      profile.gender =
        gender ||
        profile.gender;

      profile.age =
        age || profile.age;

      profile.height =
        height ||
        profile.height;

      profile.weight =
        weight ||
        profile.weight;

      profile.bloodGroup =
        bloodGroup ||
        profile.bloodGroup;



      // ================= FAMILY MEMBERS =================

      if (familyMembers) {

        profile.familyMembers =
          typeof familyMembers ===
          "string"
            ? JSON.parse(
                familyMembers
              )
            : familyMembers;
      }



      // ================= STATUS =================

      if (
        typeof isActive !==
        "undefined"
      ) {

        profile.isActive =
          isActive;
      }



      // ================= PROFILE IMAGE UPDATE =================

      if (
        req.files?.profileImage?.[0]
      ) {

        // DELETE OLD IMAGE

        if (
          profile.profileImage
            ?.publicId
        ) {

          await deleteFile(
            profile
              .profileImage
              .publicId
          );
        }



        const uploaded =
          await uploadFile(
            req.files
              .profileImage[0]
          );



        profile.profileImage = {

          url: uploaded.url,

          publicId:
            uploaded.publicId,
        };
      }



      await profile.save();



      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        data: profile,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };



// ================= DELETE PROFILE =================

exports.deleteProfile =
  async (req, res) => {

    try {

      const profile =
        await Profile.findById(
          req.params.id
        );



      if (!profile) {

        return res.status(404).json({

          success: false,

          message:
            "Profile not found",
        });
      }



      // ================= DELETE IMAGE =================

      if (
        profile.profileImage
          ?.publicId
      ) {

        await deleteFile(
          profile
            .profileImage
            .publicId
        );
      }



      await profile.deleteOne();



      res.status(200).json({

        success: true,

        message:
          "Profile deleted successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };