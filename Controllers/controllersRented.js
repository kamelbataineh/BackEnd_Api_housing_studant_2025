const Rented = require("../models/rentedModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
////////////////////////////////////////
///
///
///
///
// تسجيل مستخدم جديد مأجر
///
///
///
///
////////////////////////////////////////

exports.registerRented = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ التحقق من أن الحقول المطلوبة موجودة
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required/جميع الحقول مطلوبة" });
    }

    // ✅ التحقق من وجود الإيميل مسبقًا
    const existingUser = await Rented.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "The email already exists/البريد الإلكتروني موجود مسبقاً",
      });
    }

    // ✅ استخراج الاسم قبل @ من الإيميل
    const username = email.split("@")[0];

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ إنشاء المستخدم الجديد
    const newRented = new Rented({
      username, // الاسم المأخوذ من الإيميل
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // ✅ حفظ المستخدم
    await newRented.save();

    res
      .status(201)
      .json({ message: "Register successfully!/تم التسجيل بنجاح!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "There was a server error/حدث خطأ في السيرفر" });
  }
};

////////////////////////////////////////
///
///
///
///
// تسجيل دخول المستخدم مأجر
///
///
///
///
////////////////////////////////////////
exports.loginRented = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 🧩 التحقق من الإدخال
    if (!identifier || !password) {
      return res.status(400).json({
        error: "الرجاء إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور.",
      });
    }

    // 🔍 البحث عن المستخدم بناءً على الإيميل أو اسم المستخدم
    const user = await Rented.findOne({
      $or: [
        { email: identifier.trim().toLowerCase() },
        { username: identifier.trim().toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(404).json({
        error:
          "المستخدم غير موجود. الرجاء التأكد من اسم المستخدم أو البريد الإلكتروني.",
      });
    }

    // 🔑 التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "كلمة المرور غير صحيحة.",
      });
    }

    // 🪪 إنشاء التوكن JWT
    const token = jwt.sign(
      { id: user._id, role: "rented" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ تسجيل الدخول ناجح
    return res.status(200).json({
      message: "تم تسجيل الدخول بنجاح.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ error: "حدث خطأ في السيرفر. الرجاء المحاولة لاحقًا." });
  }
};

////////////////////////////////////////
///
///
///
///
// جلب بيانات المستخدم profile
///
///
///
///
////////////////////////////////////////
exports.getProfileRented = async (req, res) => {
  try {
    const user = await Rented.findById(req.params.id).select("username email");
    if (!user)
      return res
        .status(404)
        .json({ message: "The user does not exist/المستخدم غير موجود" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "There was a server error/حدث خطأ في السيرفر" });
  }
};
exports.updateProfileRented = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, currentPassword } = req.body;

    if (!currentPassword)
      return res.status(400).json({ message: "كلمة المرور مطلوبة للتعديل" });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "معرّف المستخدم غير صالح" });

    const user = await Rented.findById(id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    // التحقق من كلمة المرور الحالية
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });

    // التحقق من اسم المستخدم إذا تم تغييره
    if (username && username.trim() !== user.username) {
      const usernameExists = await Rented.findOne({
        username: username.trim(),
      });
      if (usernameExists)
        return res.status(400).json({ message: "اسم المستخدم مستخدم مسبقاً" });
      user.username = username.trim();
    }

    // التحقق من الإيميل إذا تم تغييره
    if (email && email.trim().toLowerCase() !== user.email) {
      const emailExists = await Rented.findOne({
        email: email.trim().toLowerCase(),
      });
      if (emailExists)
        return res
          .status(400)
          .json({ message: "البريد الإلكتروني مستخدم مسبقاً" });
      user.email = email.trim().toLowerCase();
    }

    await user.save();

    res.status(200).json({
      message: "تم تحديث بيانات المستخدم بنجاح",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const { userId, currentPassword } = req.body;
    const user = await Rented.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (isMatch) return res.status(200).json({ message: "كلمة المرور صحيحة" });
    else return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};
