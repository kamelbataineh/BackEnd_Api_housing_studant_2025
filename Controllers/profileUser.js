// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// ================= إعداد رفع الصور =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // مجلد حفظ الصور
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم الملف
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("الملف مش صورة"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ================= التحقق من التوكن =================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "توكن غير موجود" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "توكن غير صالح" });
    req.userId = decoded.id;
    next();
  });
};

// ================= Routes =================

// GET /api/user/profile/:id
router.get("/profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id) {
      return res.status(403).json({ message: "غير مسموح بالوصول" });
    }

    const user = await User.findById(req.params.id).select(
      "username email image"
    );
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image
        ? `${req.protocol}://${req.get("host")}/${user.image}`
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
});

// PUT /api/user/profile/update/:id
router.put("/profile/update/:id", verifyToken, async (req, res) => {
  console.log("PUT request received for user:", req.params.id);
  console.log("Received body:", req.body);
  try {
    if (req.userId.toString() !== req.params.id) {
      return res.status(403).json({ message: "غير مسموح بالوصول" });
    }

    console.log("Received body:", req.body); // هذا يظهر لك في console عند تشغيل nodemon

    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
