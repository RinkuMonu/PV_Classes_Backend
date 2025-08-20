import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"], // % ya fixed discount
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Track which users already used this coupon
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index for faster querying
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

// Pre-save hook to uppercase the code
couponSchema.pre("save", function (next) {
  this.code = this.code.toUpperCase();
  this.updatedAt = Date.now();
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;