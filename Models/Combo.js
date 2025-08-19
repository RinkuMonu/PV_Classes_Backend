const mongoose = require("mongoose");

const ComboSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true },
        discount_price: { type: Number, default: 0 },
        validity: { type: Number, default: 0 }, // in days
        status: { type: String, enum: ["active", "inactive"], default: "active" },

        // Relations
        books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
        testSeries: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestSeries" }],
        pyqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PYQ" }],

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Combo", ComboSchema);
