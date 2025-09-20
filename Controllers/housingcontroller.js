const express = require("express");
const router = express.Router();
const Housing = require("../models/housingModel");
const multer = require("multer");
const path = require("path");

// إعداد multer لحفظ الصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // مجلد لحفظ الصور
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const addHousing = async (req, res) => {
  try {
    const {
      housingName,
      residentType,
      governorate,
      region,
      phoneNumber,
      address,
      googleMapLink,
      dailyPrice,
      weeklyPrice,
      monthlyPrice,
    } = req.body;

    // الصور المرفوعة
    const images = req.files ? req.files.map((file) => file.path) : [];

    const newHousing = new Housing({
      housingName,
      residentType,
      governorate,
      region,
      phoneNumber,
      address,
      googleMapLink,
      dailyPrice: dailyPrice ? parseFloat(dailyPrice) : undefined,
      weeklyPrice: weeklyPrice ? parseFloat(weeklyPrice) : undefined,
      monthlyPrice: monthlyPrice ? parseFloat(monthlyPrice) : undefined,
      images,
      // owner: req.userId // ممكن تحذفها إذا ما بدك verifyToken
    });

    await newHousing.save();

    res
      .status(201)
      .json({ message: "تم إضافة السكن بنجاح", housing: newHousing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};

const getAllHousings = async (req, res) => {
  try {
    const { governorate } = req.query;
    const query = governorate ? { governorate } : {};
    const housings = await Housing.find(query);
    res.status(200).json(housings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// جلب عقار واحد حسب _id
const getHousingById = async (req, res) => {
  try {
    const { id } = req.params;
    const housing = await Housing.findById(id);

    if (!housing) return res.status(404).json({ message: "العقار غير موجود" });

    res.status(200).json(housing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};
const getHousingfilter = async (req, res) => {
  const { university, gender } = req.query; // استقبل القيم من ال query
  try {
    const housings = await Housing.find({
      region: { $regex: `^${university}$`, $options: "i" }, // استخدم region بدل university
      residentType: { $regex: `^${gender}$`, $options: "i" },
    });
    res.json(housings); // أرسل النتائج
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 البحث حسب الاسم (housingName)
const getHousingSearch = async (req, res) => {
  const { name } = req.query;
  try {
    const housings = await Housing.find({
      housingName: { $regex: name, $options: "i" }, // بحث جزئي + مش حسّاس لحالة الأحرف
    });
    res.json(housings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addHousing,
  getAllHousings,
  getHousingById,
  getHousingfilter,
  getHousingSearch,
};
