const express = require("express");
const router = express.Router();
const Housing = require("../models/housingModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
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

    const images = req.files ? req.files.map((file) => file.path) : [];

    const newHousing = new Housing({
      housingName,
      residentType,
      governorate,
      owner: req.userId,
      region,
      phoneNumber,
      address,
      googleMapLink,
      dailyPrice: dailyPrice ? parseFloat(dailyPrice) : undefined,
      weeklyPrice: weeklyPrice ? parseFloat(weeklyPrice) : undefined,
      monthlyPrice: monthlyPrice ? parseFloat(monthlyPrice) : undefined,
      images,
    });

    await newHousing.save();

    res.status(201).json({
      message: "Housing has been successfully added/ تم إضافة السكن بنجاح",
      housing: newHousing,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "There was a server error/ حدث خطأ في السيرفر" });
  }
};
////////////////////////////////////////
///
// اضهار الكل
///
////////////////////////////////////////
const getAllHousings = async (req, res) => {
  try {
    const { governorate } = req.query;
    const query = governorate ? { governorate } : {};

    const housings = await Housing.find(query).populate(
      "owner",
      "username email"
    );

    res.status(200).json(housings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error / خطأ بالسيرفر" });
  }
};

////////////////////////////////////////
///
///اظهار حسب ال id
///
////////////////////////////////////////
const getHousingById = async (req, res) => {
  try {
    const { id } = req.params;

    const housing = await Housing.findById(id).populate(
      "ownerId",
      "username email"
    );

    if (!housing)
      return res
        .status(404)
        .json({ message: "The property does not exist/العقار غير موجود" });

    res.status(200).json(housing);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "There was a server error/حدث خطأ في السيرفر" });
  }
};

////////////////////////////////////////
///
/// فلتر حسب طلب المستخدم
///
////////////////////////////////////////
const getHousingfilter = async (req, res) => {
  const { university, gender } = req.query;
  try {
    const housings = await Housing.find({
      region: { $regex: `^${university}$`, $options: "i" },
      residentType: { $regex: `^${gender}$`, $options: "i" },
    });
    res.json(housings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
////////////////////////////////////////
///
/// بحث عن سكن
///
////////////////////////////////////////
const getHousingSearch = async (req, res) => {
  const { name } = req.query;
  try {
    const housings = await Housing.find({
      housingName: { $regex: name, $options: "i" },
    });
    res.json(housings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

////////////////////////////////////////
///
/// اظهار سكن يخص المستخدم الحالي فقط
///
////////////////////////////////////////

const getMyHousing = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const myHousings = await Housing.find({ owner: userId });

    res.status(200).json(myHousings);
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ في السيرفر", error: err.message });
  }
};

module.exports = { getMyHousing };

////////////////////////////////////////
///
/// حذف سكن يخص المستخدم الحالي فقط
///
////////////////////////////////////////
const deleteHousing = async (req, res) => {
  try {
    const housing = await Housing.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!housing) {
      return res
        .status(404)
        .json({ message: "السكن غير موجود أو ليس لديك صلاحية لحذفه" });
    }

    res.json({ message: "تم حذف السكن بنجاح" });
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
  getMyHousing,
  deleteHousing,
  // updateHousing,
};

////////////////////////////////////////
///
/// تعديل سكن يخص المستخدم الحالي فقط
///
////////////////////////////////////////
// const updateHousing = async (req, res) => {
//   try {
//     const housing = await Housing.findOneAndUpdate(
//       { _id: req.params.id, owner: req.userId },
//       req.body,
//       { new: true }
//     );

//     if (!housing) {
//       return res
//         .status(404)
//         .json({ message: "السكن غير موجود أو ليس لديك صلاحية لتعديله" });
//     }

//     res.json(housing);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
