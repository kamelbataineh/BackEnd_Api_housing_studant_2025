// File: controllers/controllersRented.js
const Rented = require("../models/rentedModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// --------------------------
// تسجيل مستخدم جديد للإيجارات
// --------------------------
exports.registerRented = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // تحقق إذا المستخدم موجود مسبقاً
    const existingUser = await Rented.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني موجود مسبقاً" });
    }

    // تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد
    const newRented = new Rented({
      username,
      email,
      password: hashedPassword,
    });

    await newRented.save();

    res.status(201).json({ message: "تم التسجيل بنجاح!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};

// --------------------------
// تسجيل دخول المستخدم الإداري
// --------------------------
exports.loginRented = async (req, res) => {
  const { email, password } = req.body;

  try {
    // البحث عن المستخدم
    const user = await Rented.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "البريد الإلكتروني أو كلمة السر خاطئة" });
    }

    // التحقق من كلمة السر
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "البريد الإلكتروني أو كلمة السر خاطئة" });
    }

    // إنشاء توكن JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ في السيرفر" });
  }
};
