const express = require("express");
const router = express.Router();
const authController = require("../Controllers/controllersUser");
const rentedController = require("../Controllers/controllersRented");
const profileRented = require("../Controllers/profileRented");
const profileUser = require("../Controllers/profileUser");
const housingcontroller = require("../Controllers/housingcontroller");
const chatController = require("../Controllers/chatcontroller");

const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../Middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// rented
router.post("/Rentedregister", rentedController.registerRented);
router.post("/Rentedlogin", rentedController.loginRented);
router.get("/rented/profile/:id", rentedController.getProfileRented);
router.put("/rented/profileupdate/:id", rentedController.updateProfileRented);
router.post("/rented/verify-password", rentedController.verifyPassword);

// user
router.get("/user/profile/:id", authController.getProfileUser);
router.put("/user/profile/update/:id", authController.getProfileUser);
router.post("/Userregister", authController.registerUser);
router.post("/Userlogin", authController.loginUser);

router.post(
  "/housing/add",
  verifyToken,
  upload.array("images", 10),
  housingcontroller.addHousing
);

router.get("/housing", housingcontroller.getAllHousings);
router.get("/housing/filter", housingcontroller.getHousingfilter);
router.get("/housing/search", housingcontroller.getHousingSearch);
router.get("/housing/my", verifyToken, housingcontroller.getMyHousing);
// router.put("/housing/update/:id", housingcontroller.updateHousing);
router.delete("/housing/delete/:id", housingcontroller.deleteHousing);

// إنشاء محادثة
router.post("/chat/create", chatController.createChat);

// إرسال رسالة
router.post("/chat/:chatId/message", chatController.sendMessage);

// قائمة المحادثات
router.get("/chat/list/:userId", chatController.getChatList);

// جلب الرسائل
router.get("/chat/:chatId/messages", chatController.getMessages);
module.exports = router;
