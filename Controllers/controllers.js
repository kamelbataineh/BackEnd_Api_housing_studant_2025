// قاعدة بيانات مؤقتة (كمصفوفة لتجربة)
const users = [];

// تسجيل مستخدم جديد
exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  // تحقق من البيانات
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "يرجى إدخال اسم المستخدم وكلمة المرور" });
  }

  // تحقق من وجود المستخدم مسبقًا
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ error: "اسم المستخدم موجود مسبقًا" });
  }

  // تخزين المستخدم (بدون تشفير حاليا)
  users.push({ username, password });
  res.json({ message: "تم التسجيل بنجاح" });
};

// تسجيل دخول مستخدم
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "يرجى إدخال اسم المستخدم وكلمة المرور" });
  }

  // البحث عن المستخدم
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  res.json({ message: "تم تسجيل الدخول بنجاح" });
};
