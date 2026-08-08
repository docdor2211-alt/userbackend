
// server.js

const express =
  require("express");

const dotenv =
  require("dotenv");

const cors =
  require("cors");

const http =
  require("http");;;

const { Server } =
  require("socket.io");

const connectDB =
  require("./config/db");



/* =====================================================
   CONFIG
===================================================== */

dotenv.config();

connectDB();



/* =====================================================
   EXPRESS APP
===================================================== */

const app =
  express();



/* =====================================================
   HTTP SERVER
===================================================== */

const server =
  http.createServer(app);



/* =====================================================
   SOCKET.IO
===================================================== */

const io =
  new Server(server, {

    cors: {

      origin: [

        "http://localhost:3000",

        "http://localhost:3001",

        "http://localhost:7000",

        "https://sandeepdocside.onrender.com",

      ],

      credentials: true,

      methods: [

        "GET",

        "POST",

      ],

    },

  });



/* =====================================================
   STORE IO
===================================================== */

app.set("io", io);



/* =====================================================
   SOCKET CONNECTION
===================================================== */

io.on(

  "connection",

  (socket) => {

    console.log(
      "✅ Socket Connected:",
      socket.id
    );



    /* =========================
       JOIN CHAT ROOM
    ========================= */

    socket.on(

      "join_chat",

      (conversationId) => {

        socket.join(
          conversationId
        );

        console.log(
          "✅ Joined Room:",
          conversationId
        );

      }

    );



    /* =========================
       SEND MESSAGE
    ========================= */

    socket.on(

      "send_message",

      (data) => {

        io.to(
          data.conversationId
        ).emit(

          "receive_message",

          data

        );

      }

    );



    /* =========================
       TYPING
    ========================= */

    socket.on(

      "typing",

      (data) => {

        socket.to(
          data.conversationId
        ).emit(

          "typing",

          data

        );

      }

    );



    /* =========================
       STOP TYPING
    ========================= */

    socket.on(

      "stop_typing",

      (data) => {

        socket.to(
          data.conversationId
        ).emit(

          "stop_typing",

          data

        );

      }

    );



    /* =========================
       DISCONNECT
    ========================= */

    socket.on(

      "disconnect",

      () => {

        console.log(
          "❌ Socket Disconnected:",
          socket.id
        );

      }

    );

  }

);



/* =====================================================
   CORS
===================================================== */

app.use(

  cors({

    origin: [

      "http://localhost:3000",

      "http://localhost:3001",

      "http://localhost:7000",

      "https://sandeepdocside.onrender.com",

    ],

    credentials: true,

    methods: [

      "GET",

      "POST",

      "PUT",

      "DELETE",

      "OPTIONS",

    ],

    allowedHeaders: [

      "Content-Type",

      "Authorization",

    ],

  })

);

const notificationRoutes = require("./routes/notificationRoutes");

/* =====================================================
   BODY PARSER
===================================================== */

app.use(express.json());

app.use(

  express.urlencoded({

    extended: true,

  })

);



/* =====================================================
   ROUTES
===================================================== */

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/upload",
  require("./routes/uploadRoutes")
);

app.use(
  "/api/categories",
  require("./routes/categoryRoutes")
);

app.use(
  "/api/doctors",
  require("./routes/doctorRoutes")
);

app.use(
  "/api/appointments",
  require("./routes/appointmentRoutes")
);

app.use(
  "/api/symptoms",
  require("./routes/symptomRoutes")
);

app.use(
  "/api/online-symptoms",
  require("./routes/onlineSymptomRoutes")
);

app.use(
  "/api/medicines",
  require("./routes/medicineRoutes")
);

app.use(
  "/api/surgeries",
  require("./routes/surgeryRoutes")
);

app.use(
  "/api/subcategories",
  require("./routes/subCategoryRoutes")
);

// app.use(
//   "/api/medicineItem",
//   require("./routes/medicineItemRoutes")
// );

app.use(
  "/api/labCategories",
  require("./routes/labCategoryRoutes")
);

app.use(
  "/api/surgery-categories",
  require("./routes/surgeryCategoryRoutes")
);

app.use(
  "/api/lab-tests",
  require("./routes/labTestRoutes")
);

app.use(
  "/api/checkup-types",
  require("./routes/checkupTypeRoutes")
);

app.use(
  "/api/pet-categories",
  require("./routes/petCategoryRoutes")
);

app.use(

  "/api/user-pet-care-products",

  require(
    "./routes/userPetCareProductRoutes"
  )

);
app.use("/api/notifications", notificationRoutes);
app.use(
  "/api/offers",
  require("./routes/offerRoutes")
);

// ✅ MEDICINE CATEGORY ROUTES
app.use(
  "/api/medicine-categories",
  require(
    "./routes/medicineCategoryRoutes"
  )
);
// app.use(
//   "/api/medicine-products",
//   require(
//     "./routes/medicineProductRoutes"
//   )
// );
app.use(
  "/api/medicine-subcategories",
  require(
    "./routes/medicineSubCategoryRoutes"
  )
);


// ✅ MEDICINE ITEM ROUTES
app.use(
  "/api/medicine-items",
  require(
    "./routes/medicineItemRoutes"
  )
);

app.use(
  "/api/featured-services",
  require("./routes/featuredServiceRoutes")
);

app.use(
  "/api/health-package-category",
  require("./routes/healthPackageCategoryRoutes")
);

app.use(
  "/api/health-package",
  require("./routes/healthPackageRoutes")
);

app.use(
  "/api/profile",
  require("./routes/profileRoutes")
);

app.use(
  "/api/medicine-orders",
  require("./routes/medicineOrderRoutes")
);

app.use(
  "/api/lab-bookings",
  require("./routes/labBookingRoutes")
);

app.use(
  "/api/pet-orders",
  require("./routes/petOrderRoutes")
);

app.use(
  "/api/user-chat",
  require("./routes/userChatRoutes")
);

app.use(
  "/api/video-call",
  require("./routes/videoCallRoutes")
);

app.use(
  "/api/wallet",
  require("./routes/walletRoutes")
);

app.use(
  "/api/payment",
  require("./routes/paymentRoutes")
);
const userPickupOrderRoutes =
require(
"./routes/userPickupOrderRoutes"
);

app.use(
"/api/user-pickup-order",
userPickupOrderRoutes
);
app.use(
  "/api/prescriptions",
  require(
    "./routes/prescriptionRoutes"
  )
);
app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/report-images",
  require(
    "./routes/reportImageRoutes"
  )
);
app.use(

  "/api/user-stories",

  require(
    "./routes/userStoryRoutes"
  )

);

// ✅ ROUTES

const symptomCategoryRoutes =
  require(
    "./routes/symptomCategoryRoutes"
  );


// ✅ USE ROUTES

app.use(
  "/api/symptom-categories",
  symptomCategoryRoutes
);

  
const userOrderRoutes = require("./routes/userOrderRoutes");

app.use("/api/orders", userOrderRoutes);
/* =====================================================
   DEFAULT ROUTE
===================================================== */

app.get(

  "/",

  (req, res) => {

    res.send(
      "API Running 🚀"
    );

  }

);



/* =====================================================
   INVALID ROUTE
===================================================== */

app.use(

  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        "Route not found",

    });

  }

);



/* =====================================================
   START SERVER
===================================================== */

const PORT =
  process.env.PORT || 7000;



server.listen(

  PORT,

  () => {

    console.log(
      `🚀 Server running on port ${PORT}`
    );

  }

);