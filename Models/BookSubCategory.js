const mongoose = require("mongoose");

const BookSubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    book_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCategory",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookSubCategory", BookSubCategorySchema);
