const Story =
  require(
    "../models/storyModel"
  );



// ======================================================
// GET ALL STORIES
// ======================================================

exports.getStories =
  async (req, res) => {

    try {

      const stories =
        await Story.find({

          isActive: true,
          expiresAt: {
            $gt: new Date(),
          },

        })

          .populate(

            "doctorId",

            "name email image"

          )

          .sort({

            createdAt: -1,

          });



      res.status(200).json({

        success: true,

        count:
          stories.length,

        data:
          stories,

      });

    } catch (error) {

      console.log(
        "GET STORIES ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET SINGLE STORY
// ======================================================

exports.getSingleStory =
  async (req, res) => {

    try {

      const story =
        await Story.findOne({

          _id:
            req.params.id,

          isActive:
            true,

          expiresAt: {
            $gt: new Date(),
          },

        }).populate(

          "doctorId",

          "name email image"

        );

      if (!story) {

        return res.status(404).json({

          success: false,

          message:
            "Story not found or expired",

        });

      }

      res.status(200).json({

        success: true,

        data:
          story,

      });

    } catch (error) {

      console.log(
        "GET SINGLE STORY ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };