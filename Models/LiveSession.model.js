const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    channelName: { type: String, required: true },
    status: {
      type: String,
      enum: ["live", "ended"],
      default: "live",
    },
    startedBy: { type: Number, required: true }, // teacher uid
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveSession", liveSessionSchema);
