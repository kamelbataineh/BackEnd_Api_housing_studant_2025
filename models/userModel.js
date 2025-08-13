const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false }, // ← اسم المستخدم
  email: { type: String, required: true, unique: true }, // الإيميل لازم يكون فريد
  password: { type: String, required: true }, // الباسورد مشفر
  role: { type: String, default: "user" }, // الدور user أو admin
  createdAt: { type: Date, default: Date.now }, // وقت إنشاء المستخدم
});

module.exports = mongoose.model("User", UserSchema); // تصدير الموديل
