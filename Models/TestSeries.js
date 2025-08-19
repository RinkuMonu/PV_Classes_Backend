const mongoose = require("mongoose");

const testSeriesSchema = new mongoose.Schema(
  {
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    title_tag: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
      default: 0,
    },
    validity: {
      type: String,
      required: true,
    },
    total_tests: {
      type: Number,
      default: 0,
    },
    subjects: [
      {
        name: String,
        test_count: Number,
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
console.log("BASE_URL:", process.env.BASE_URL);
// Virtual for full image URLs
testSeriesSchema.virtual("full_image").get(function () {
  if (!this.images || this.images.length === 0) return [];
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  return this.images.map(img => `${baseUrl}/uploads/testSeries/${img}`);
});

module.exports = mongoose.model("TestSeries", testSeriesSchema);
