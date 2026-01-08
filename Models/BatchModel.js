const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    name: {
      type: String,
      required: true, // e.g. "Morning Batch", "SSC GD 2025 Batch A"
      trim: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    // Optional – seats mgmt
    seatLimit: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    // Teachers / faculties for this batch
    faculties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],

    language: {
      type: String,
      default: "English",
    },

    status: {
      type: String,
      enum: ["upcoming", "running", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }

  
);


// Batch -> Topics (reverse relation)
batchSchema.virtual("topics", {
  ref: "Topic",          // model name
  localField: "_id",     // Batch._id
  foreignField: "batch", // Topic.batch
});


// ✅ yeh DO line bahut important hain
batchSchema.set("toJSON", { virtuals: true });
batchSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Batch", batchSchema);
