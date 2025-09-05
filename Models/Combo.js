const mongoose = require("mongoose");

const ComboSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true }, // original price
        discountPercent: { type: Number, default: 0 }, // discount in percent
        discount_price: { type: Number, default: 0 }, // calculated price after discount
        validity: { type: Number, default: 0 }, // in days
        status: { type: String, enum: ["active", "inactive"], default: "active" },

        // Relations
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
        books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
        testSeries: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestSeries" }],
        pyqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PYQ" }],
        notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Pre-save hook to calculate discount_price automatically
ComboSchema.pre("save", function (next) {
    if (this.discountPercent && this.discountPercent > 0) {
        this.discount_price = this.price - (this.price * this.discountPercent) / 100;
    } else {
        this.discount_price = this.price;
    }
    next();
});

module.exports = mongoose.model("Combo", ComboSchema);
