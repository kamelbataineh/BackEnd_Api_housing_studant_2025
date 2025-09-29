const Rented = require("../models/rentedModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required/جميع الحقول مطلوبة" });
    }

    const existingUser = await Rented.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "The email already exists/البريد الإلكتروني موجود مسبقاً",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRented = new Rented({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

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
  const { identifier, password } = req.body; // identifier = username / email

  try {
    const user = await Rented.findOne({
      $or: [
        { username: identifier.trim().toLowerCase() },
        { email: identifier.trim().toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(400).json({
        error:
          "Wrong username/email or password / اسم المستخدم/الإيميل أو كلمة السر خاطئة",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error:
          "Wrong username/email or password / اسم المستخدم/الإيميل أو كلمة السر خاطئة",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Successfully logged in / تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "There was a server error/حدث خطأ في السيرفر" });
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
