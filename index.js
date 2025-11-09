const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectDB = require("./Configration/db");

// 🧠 اتصال بقاعدة البيانات
connectDB();

// إعدادات عامة
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🛣️ استيراد المسارات
const apiRoutes = require("./Routes/apiRoutes");
app.use("/api", apiRoutes);

// 🚀 تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});

// npm i nodemon === >   nodmon
// npm install mongoose
// npm install bcrypt
// npm install jsonwebtoken
