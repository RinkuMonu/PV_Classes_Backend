import { validationResult } from "express-validator";
import Coupon from "../Models/coupon.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const couponData = req.body;
        const coupon = new Coupon(couponData);
        await coupon.save();

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get all coupons
export const getAllCoupons = async (req, res) => {
  const userId = req.user.id;
  try {
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
      usedBy: { $ne: userId }, // logged-in user id not in usedBy
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get single coupon by ID
export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update coupon
export const updateCoupon = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (req.body.startDate && req.body.endDate) {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);

            if (endDate <= startDate) {
                return res.status(400).json({
                    success: false,
                    message: "End date must be after start date",
                });
            }
        }

        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Validate coupon at checkout
export const validateCoupon = async (req, res) => {
  try {
    const { code, userId, cartTotal } = req.body; // 👈 pass cart total & userId
    const now = new Date();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    // 👉 Check if user already used this coupon
    if (coupon.usedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already used this coupon",
      });
    }

    // 👉 Check minimum order amount
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount should be ₹${coupon.minOrderAmount}`,
      });
    }

    // 👉 Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    const finalPrice = cartTotal - discount;

    // 👉 Update coupon usage (mark this user as used)
    coupon.usedBy.push(userId);
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount,
      finalPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
