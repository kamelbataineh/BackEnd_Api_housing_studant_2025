const mongoose = require("mongoose");

const housingSchema = new mongoose.Schema({
  housingName: { type: String, required: true },
  residentType: { type: String, required: true },
  governorate: { type: String, required: true },
  region: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  googleMapLink: { type: String },
  dailyPrice: { type: Number },
  weeklyPrice: { type: Number },
  monthlyPrice: { type: Number },
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Rented" },
});

module.exports = mongoose.model("Housing", housingSchema);
