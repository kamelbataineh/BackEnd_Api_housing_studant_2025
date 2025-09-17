const mongoose = require("mongoose");
const connectDB = require("./Configration/db");

connectDB();

//1 نطلب مكتبة Express
//2 ننشئ تطبيق Express (السيرفر)
//3 -------// نحدد رقم البورت (المنفذ) اللي السيرفر بيشتغل عليه
//----------------------------------------------//
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//---------------------------------------ستيراد المسارات
const apiRoutes = require("./Routes/apiRoutes");
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// npm i nodemon === >   nodmon
// npm install mongoose
// npm install bcrypt
// npm install jsonwebtoken
