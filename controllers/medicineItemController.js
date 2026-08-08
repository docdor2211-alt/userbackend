// const MedicineItem = require("../models/medicineItem.model");
// const { uploadFile, deleteFile } = require("../utils/bunnyUpload");


// // ================= CREATE =================
// exports.createMedicine = async (req, res) => {
//   try {
//     const { name, description, price } = req.body;  // ✅ REMOVED subCategory

//     // 🔹 validation - ONLY name and price required
//     if (!name || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "Name & price required"
//       });
//     }

//     let imageData = null;

//     // ✅ CASE 1: FILE (form-data)
//     if (req.files && req.files.image && req.files.image.length > 0) {
//       const uploadRes = await uploadFile(req.files.image[0]);

//       imageData = {
//         url: uploadRes.url,
//         publicId: uploadRes.publicId
//       };
//     }

//     // ✅ CASE 2: JSON (raw body)
//     else if (req.body.image) {
//       let img = req.body.image;

//       // agar string me aaye (kabhi form-data se)
//       if (typeof img === "string") {
//         try {
//           img = JSON.parse(img);
//         } catch (e) {}
//       }

//       if (img?.url && img?.publicId) {
//         imageData = img;
//       }
//     }

//     // ❌ image required
//     if (!imageData) {
//       return res.status(400).json({
//         success: false,
//         message: "Image required"
//       });
//     }

//     const data = await MedicineItem.create({
//       name,
//       description: description || "",
//       price,
//       image: imageData
//       // ❌ NO subCategory field here
//     });

//     res.status(201).json({
//       success: true,
//       data
//     });

//   } catch (err) {
//     console.error("Create error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // ================= GET ALL =================
// exports.getMedicines = async (req, res) => {
//   try {
//     const page = Math.max(parseInt(req.query.page) || 1, 1);
//     const limit = Math.max(parseInt(req.query.limit) || 10, 1);
//     const search = req.query.search || "";

//     const skip = (page - 1) * limit;

//     // const query = {
//     //   name: { $regex: search, $options: "i" }
//     // };
//     const query = {
//   $or: [
//     {
//       name: {
//         $regex: search,
//         $options: "i"
//       }
//     },

//     {
//       productTitle: {
//         $regex: search,
//         $options: "i"
//       }
//     }
//   ]
// };

//     const total = await MedicineItem.countDocuments(query);

//     const medicines = await MedicineItem.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const formatted = medicines.map((item) => {
//     const oldPrice =
//   item.price ||
//   item.mrp ||
//   0;
//       const discount = Math.floor(Math.random() * 10) + 5;

//       const newPrice = Math.round(
//         oldPrice - (oldPrice * discount) / 100
//       );

//       return {
//         id: item._id,
//         name:
//   item.name ||
//   item.productTitle,
//         description: item.description,
//         type: "Strip of tablets",
//         delivery: "Delivery by Tomorrow 9 PM",
//         oldPrice,
//         newPrice,
//         discount: `${discount}% off`,
//         prescription: false,
//         imageUrl: item.image?.url || "",
//         image: item.image
//       };
//     });

//     res.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data: formatted
//     });

//   } catch (err) {
//     console.error("Get all error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // ================= GET BY SUBCATEGORY =================
// // Note: This endpoint will work only if you add subCategory back to schema
// // For now, either remove this or return empty array
// exports.getBySubCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Since schema has no subCategory, return empty array
//     // Or you can remove this endpoint entirely
//     res.json({
//       success: true,
//       count: 0,
//       data: []
//     });

//   } catch (err) {
//     console.error("Get by subcategory error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // ================= GET ONE =================
// exports.getMedicineById = async (req, res) => {
//   try {
//     const item = await MedicineItem.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: item
//     });

//   } catch (err) {
//     console.error("Get by ID error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // ================= UPDATE =================
// exports.updateMedicine = async (req, res) => {
//   try {
//     const item = await MedicineItem.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found"
//       });
//     }

//     const { name, description, price } = req.body;  // ✅ REMOVED subCategory

//     if (name) item.name = name;
//     if (description !== undefined) item.description = description;
//     if (price) item.price = price;

//     // 🔹 image update (file)
//     if (req.files?.image?.length > 0) {
//       if (item.image?.publicId) {
//         await deleteFile(item.image.publicId);
//       }

//       const uploadRes = await uploadFile(req.files.image[0]);

//       item.image = {
//         url: uploadRes.url,
//         publicId: uploadRes.publicId
//       };
//     }

//     // 🔹 image update (JSON)
//     else if (req.body.image) {
//       let img = req.body.image;

//       if (typeof img === "string") {
//         try {
//           img = JSON.parse(img);
//         } catch (e) {}
//       }

//       if (img?.url && img?.publicId) {
//         if (item.image?.publicId && item.image.publicId !== img.publicId) {
//           await deleteFile(item.image.publicId);
//         }
//         item.image = img;
//       }
//     }

//     await item.save();

//     res.json({
//       success: true,
//       data: item
//     });

//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // ================= DELETE =================
// exports.deleteMedicine = async (req, res) => {
//   try {
//     const item = await MedicineItem.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found"
//       });
//     }

//     if (item.image?.publicId) {
//       await deleteFile(item.image.publicId);
//     }

//     await item.deleteOne();

//     res.json({
//       success: true,
//       message: "Medicine deleted successfully"
//     });

//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };



const MedicineItem = require(
  "../models/medicineItem.model"
);

const {
  uploadFile,
  deleteFile
} = require("../utils/bunnyUpload");


// ============================================
// ✅ CREATE MEDICINE
// ============================================
exports.createMedicine =
  async (req, res) => {
    try {

      // const {
      //   medicineCategory,
      //   name,
      //   description,
      //   price
      // } = req.body;

      // // ✅ VALIDATION
      // if (
      //   !medicineCategory ||
      //   !name ||
      //   !price
      // ) {
      //   return res.status(400).json({
      //     success: false,
      //     message:
      //       "medicineCategory, name & price required"
      //   });
      // }
      
const {
  medicineSubCategory,
  name,
  description,
  price
} = req.body;


// ✅ VALIDATION
if (
  !medicineSubCategory ||
  !name ||
  !price
) {
  return res.status(400).json({
    success: false,
    message:
      "medicineSubCategory, name & price required"
  });
}



      let imageData = null;

      // ============================================
      // ✅ IMAGE FROM FILE
      // ============================================
      if (
        req.files &&
        req.files.image &&
        req.files.image.length > 0
      ) {

        const uploadRes =
          await uploadFile(
            req.files.image[0]
          );

        imageData = {
          url: uploadRes.url,
          publicId: uploadRes.publicId
        };
      }

      // ============================================
      // ✅ IMAGE FROM JSON
      // ============================================
      else if (req.body.image) {

        let img = req.body.image;

        if (typeof img === "string") {
          try {
            img = JSON.parse(img);
          } catch (e) {}
        }

        if (
          img?.url &&
          img?.publicId
        ) {
          imageData = img;
        }
      }

      // ✅ IMAGE REQUIRED
if (!imageData) {

  imageData = {
    url: "",
    publicId: ""
  };

}



      // ============================================
      // ✅ CREATE
      // ============================================
      const data =
        await MedicineItem.create({
         medicineSubCategory,
          name,
          description:
            description || "",
          price,
          image: imageData
        });

      res.status(201).json({
        success: true,
        message:
          "Medicine created successfully",
        data
      });

    } catch (err) {

      console.error(
        "CREATE MEDICINE ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ============================================
// ✅ GET ALL MEDICINES
// ============================================
exports.getMedicines =
  async (req, res) => {
    try {

      const page =
        parseInt(req.query.page) || 1;

      const limit =
        parseInt(req.query.limit) || 10;

      const search =
        req.query.search || "";

      const medicineCategory =
        req.query.medicineCategory || "";

      const skip =
        (page - 1) * limit;

      // ============================================
      // ✅ FILTER QUERY
      // ============================================
      let query = {
        isActive: true
      };

      // ✅ SEARCH
      if (search) {
        query.name = {
          $regex: search,
          $options: "i"
        };
      }

      // ✅ CATEGORY FILTER
      if (medicineCategory) {
        query.medicineCategory =
          medicineCategory;
      }

      // ============================================
      // ✅ TOTAL
      // ============================================
      const total =
        await MedicineItem.countDocuments(
          query
        );

      // ============================================
      // ✅ GET DATA
      // ============================================
      const medicines =
        await MedicineItem.find(query)

       
.populate(
  "medicineSubCategory",
  "title"
)



          .sort({
            createdAt: -1
          })

          .skip(skip)

          .limit(limit);

      res.json({
        success: true,
        page,
        limit,
        total,
        data: medicines
      });

    } catch (err) {

      console.error(
        "GET MEDICINES ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ============================================
// ✅ GET MEDICINES BY SUB CATEGORY
// ============================================
exports.getBySubCategory =
  async (req, res) => {
    try {

      const medicines =
      
await MedicineItem.find({
  medicineSubCategory:
    req.params.id,

  isActive: true
})



          .populate(
            "medicineCategory",
            "title"
          )

          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        count: medicines.length,
        data: medicines
      });

    } catch (err) {

      console.error(
        "GET BY SUBCATEGORY ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ============================================
// ✅ GET SINGLE MEDICINE
// ============================================
exports.getMedicineById =
  async (req, res) => {
    try {

      const medicine =
        await MedicineItem.findById(
          req.params.id
        )

          .populate(
            "medicineCategory",
            "title"
          );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found"
        });
      }

      res.json({
        success: true,
        data: medicine
      });

    } catch (err) {

      console.error(
        "GET MEDICINE ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ============================================
// ✅ UPDATE MEDICINE
// ============================================
exports.updateMedicine =
  async (req, res) => {
    try {

      const medicine =
        await MedicineItem.findById(
          req.params.id
        );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found"
        });
      }

      const {
        medicineCategory,
        name,
        description,
        price,
        isActive
      } = req.body;

      // ✅ UPDATE FIELDS
      if (medicineCategory) {
        medicine.medicineCategory =
          medicineCategory;
      }

      if (name) {
        medicine.name = name;
      }

      if (
        description !== undefined
      ) {
        medicine.description =
          description;
      }

      if (price) {
        medicine.price = price;
      }

      if (
        isActive !== undefined
      ) {
        medicine.isActive =
          isActive;
      }

      // ============================================
      // ✅ IMAGE UPDATE FROM FILE
      // ============================================
      if (
        req.files?.image?.length > 0
      ) {

        // delete old image
        if (
          medicine.image?.publicId
        ) {
          await deleteFile(
            medicine.image.publicId
          );
        }

        const uploadRes =
          await uploadFile(
            req.files.image[0]
          );

        medicine.image = {
          url: uploadRes.url,
          publicId:
            uploadRes.publicId
        };
      }

      // ============================================
      // ✅ IMAGE UPDATE FROM JSON
      // ============================================
      else if (req.body.image) {

        let img = req.body.image;

        if (typeof img === "string") {
          try {
            img = JSON.parse(img);
          } catch (e) {}
        }

        if (
          img?.url &&
          img?.publicId
        ) {

          if (
            medicine.image?.publicId &&
            medicine.image.publicId !==
              img.publicId
          ) {
            await deleteFile(
              medicine.image.publicId
            );
          }

          medicine.image = img;
        }
      }

      // ============================================
      // ✅ SAVE
      // ============================================
      await medicine.save();

      res.json({
        success: true,
        message:
          "Medicine updated successfully",
        data: medicine
      });

    } catch (err) {

      console.error(
        "UPDATE MEDICINE ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };



// ============================================
// ✅ DELETE MEDICINE
// ============================================
exports.deleteMedicine =
  async (req, res) => {
    try {

      const medicine =
        await MedicineItem.findById(
          req.params.id
        );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found"
        });
      }

      // ✅ DELETE IMAGE
      if (
        medicine.image?.publicId
      ) {
        await deleteFile(
          medicine.image.publicId
        );
      }

      // ✅ DELETE DOCUMENT
      await medicine.deleteOne();

      res.json({
        success: true,
        message:
          "Medicine deleted successfully"
      });

    } catch (err) {

      console.error(
        "DELETE MEDICINE ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };

