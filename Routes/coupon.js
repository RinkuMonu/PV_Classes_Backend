const express = require("express");
const router = express.Router();
const couponController = require("../Controllers/coupon");
const verifyToken = require("../middleware/auth");

// Create coupon
router.post("/", verifyToken, couponController.createCoupon);

// Get all coupons
router.get("/", couponController.getCoupons);

// Get coupon by code
router.get("/:code", couponController.getCouponByCode);

// Delete coupon
router.delete("/:id", verifyToken, couponController.deleteCoupon);

module.exports = router;
