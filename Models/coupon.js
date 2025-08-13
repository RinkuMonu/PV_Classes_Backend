const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "flat"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    expiryDate: {
        type: Date,
        required: true
    },
    providerName: {
        type: String,
        required: true
    },
    providerLogo: {
        type: String,
        default: null
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
