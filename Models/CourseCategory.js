const mongoose = require("mongoose");

const CourseCategorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    exam_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      required: true
    },
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CourseCategory", CourseCategorySchema);
