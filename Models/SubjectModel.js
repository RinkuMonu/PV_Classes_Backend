// const mongoose = require("mongoose");

// const subjectSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//       default: "No description available.",
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       default: null,
//     },
//     batch: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Batch",
//       default: null,
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Subject", subjectSchema);