const mongoose = require("mongoose");

const youTubeClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
    },

    classId: {
      type: String,
      required: true, // kis course / batch se related
    },

    orderId: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("YouTubeClass", youTubeClassSchema);
