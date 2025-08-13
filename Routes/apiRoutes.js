const express = require("express");
const router = express.Router();

const authController = require("../Controllers/controllersUser");
const rentedController = require("../Controllers/controllersRented");

// User routes
router.post("/Userregister", authController.registerUser);
router.post("/Userlogin", authController.loginUser);

// Rented routes
router.post("/Rentedregister", rentedController.registerRented);
router.post("/Rentedlogin", rentedController.loginRented);

module.exports = router;
