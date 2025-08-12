const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    book_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCategory",
      required: true,
    },
    book_subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookSubCategory",
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tag: {
      type: [String], // multiple tags
      default: [],
    },
    book_title: {
      type: String,
      required: true,
      trim: true,
    },
    book_description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
    },

    // ✅ Key Features as array of objects
    book_key_features: [
      {
        title: { type: String, required: true }, // e.g. "Publication"
        value: { type: String, required: true }, // e.g. "Utkarsh Classes & Edutech Pvt. Ltd."
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
