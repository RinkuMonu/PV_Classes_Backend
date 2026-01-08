const mongoose = require("mongoose");

const liveParticipantSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    userId: { type: Number, required: true },
    role: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveParticipant", liveParticipantSchema);
