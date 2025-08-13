const express = require("express");
const router = express.Router();

// استيراد الكونترولر المسؤول عن العمليات
const authController = require("../Controllers/controllersUser");

// مسار تسجيل مستخدم جديد
router.post("/Userregister", authController.registerUser);

// مسار تسجيل دخول
router.post("/Userlogin", authController.loginUser);

module.exports = router;
