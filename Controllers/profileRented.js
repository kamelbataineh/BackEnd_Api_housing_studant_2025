const express = require("express");
const router = express.Router();
const Rented = require("../models/rentedModel");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "توكن غير موجود" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "توكن غير صالح" });
    req.userId = decoded.id;
    next();
  });
};

////////////////////////////////////////
///
///
///
///
/// profile rented
///
///
///
///
////////////////////////////////////////
router.get("/profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: "غير مسموح بالوصول" });
    }

    const user = await Rented.findById(req.params.id).select("username email");
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
});

module.exports = router;
