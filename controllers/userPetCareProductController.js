const PetCareProduct =
  require(
    "../models/petCareProductModel"
  );



// ======================================================
// GET ALL PRODUCTS
// ======================================================

exports.getAllUserPetCareProducts =
  async (req, res) => {

    try {

      let filter = {

        isAvailable: true,

      };



      // NEED TYPE FILTER

      if (req.query.needType) {

        filter.needType =
          req.query.needType;

      }



      // AGE TYPE FILTER

      if (req.query.ageType) {

        filter.ageType =
          req.query.ageType;

      }



      // SEARCH FILTER

      if (req.query.search) {

        filter.title = {

          $regex:
            req.query.search,

          $options: "i",

        };

      }



      const products =
        await PetCareProduct.find(

          filter

        ).sort({

          createdAt: -1,

        });



      res.status(200).json({

        success: true,

        total:
          products.length,

        data:
          products,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET SINGLE PRODUCT
// ======================================================

exports.getSingleUserPetCareProduct =
  async (req, res) => {

    try {

      const product =
        await PetCareProduct.findById(

          req.params.id

        );



      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }



      res.status(200).json({

        success: true,

        data:
          product,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };