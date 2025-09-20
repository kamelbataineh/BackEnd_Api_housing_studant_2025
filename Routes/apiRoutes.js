const express = require("express");
const router = express.Router();

const authController = require("../Controllers/controllersUser");
const rentedController = require("../Controllers/controllersRented");
const profileRented = require("../Controllers/profileRented");
const profileUser = require("../Controllers/profileUser");
const housingcontroller = require("../Controllers/housingcontroller");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// User routes
router.post("/Userregister", authController.registerUser);
router.post("/Userlogin", authController.loginUser);

// Rented routes
router.post("/Rentedregister", rentedController.registerRented);
router.post("/Rentedlogin", rentedController.loginRented);

router.get("/rented/profile/:id", rentedController.getProfileRented);
router.get("/user/profile/:id", authController.getProfileUser);
router.put("/user/profile/update/:id", authController.getProfileUser);

router.post(
  "/housing/add",
  upload.array("images", 10),
  housingcontroller.addHousing
);

router.get("/housing", housingcontroller.getAllHousings);

router.get("/housing/filter", housingcontroller.getHousingfilter);
// **GET عقار واحد حسب _id**
router.get("/housing/search", housingcontroller.getHousingSearch);
router.get("/housing/:id", housingcontroller.getHousingById);
module.exports = router;
// 🔹 البحث حسب الاسم (housingName)
