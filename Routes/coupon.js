const express = require("express");
const router = express.Router();
const couponController = require("../Controllers/coupon.js");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, couponController.createCoupon);

router.get("/",verifyToken, couponController.getAllCoupons);

router.get("/:id", couponController.getCoupon);

router.put("/:id", verifyToken, couponController.updateCoupon);

router.delete("/:id", verifyToken, couponController.deleteCoupon);

router.post("/validate", couponController.validateCoupon);

module.exports = router;