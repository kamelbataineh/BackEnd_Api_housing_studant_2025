const User = require("../models/userModel"); // استدعاء موديل المستخدم
const bcrypt = require("bcrypt"); // مكتبة لتشفير الباسورد
const jwt = require("jsonwebtoken"); // مكتبة لتوليد التوكن لتسجيل الدخول

// --------------------------
// تسجيل مستخدم جديد
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // التحقق من وجود username مسبقًا
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const newUser = new User({
      username: req.body.username || req.body.email, // ← استخدام الايميل إذا لم يُرسل username
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --------------------------
// تسجيل دخول المستخدم
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // البحث عن المستخدم بالإيميل
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // التحقق من الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // توليد توكن JWT (نستطيع استخدامه للمصادقة بعدين)
    const token = jwt.sign(
      { id: user._id, role: user.role }, // نضع الآيدي والدور داخل التوكن
      process.env.JWT_SECRET, // سر التوكن مخزن بالـ .env
      { expiresIn: "1d" } // صلاحية التوكن يوم واحد
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
