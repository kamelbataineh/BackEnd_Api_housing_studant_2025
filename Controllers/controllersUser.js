const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

////////////////////////////////////////
///
///
///
///
// تسجيل مستخدم جديد
///
///
///
///
////////////////////////////////////////
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username already exists / اسم المستخدم موجود بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: req.body.username || req.body.email,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully / تم تسجيل المستخدم بنجاح",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error / خطأ بالسيرفر" });
  }
};

////////////////////////////////////////
///
///
///
///
// تسجيل دخول المستخدم
///
///
///
///
////////////////////////////////////////
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        error:
          "Invalid email or password / بريد إلكتروني أو كلمة مرور غير صالحة",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        error:
          "Invalid email or password / بريد إلكتروني أو كلمة مرور غير صالحة",
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful / تسجيل الدخول ناجح",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error / خطأ بالسيرفر " });
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
exports.getProfileUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username email");
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
