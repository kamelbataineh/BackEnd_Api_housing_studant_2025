// File: models/rentedModel.js
const mongoose = require("mongoose");

const rentedSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, // اسم المستخدم
    email: { type: String, required: true, unique: true }, // البريد الإلكتروني فريد
    password: { type: String, required: true }, // كلمة السر مشفرة
  },
  { timestamps: true }
); // تسجيل وقت الإنشاء والتعديل تلقائياً

module.exports = mongoose.model("Rented", rentedSchema);
