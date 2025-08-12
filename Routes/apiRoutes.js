const express = require("express");
const router = express.Router();

// استيراد الكونترولر المسؤول عن العمليات
const authController = require("../Controllers/controllers");

// مسار تسجيل مستخدم جديد
router.post("/register", authController.registerUser);

// مسار تسجيل دخول
router.post("/login", authController.loginUser);

module.exports = router;
