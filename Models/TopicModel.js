// models/Topic.js
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true, // Topic hamesha kisi batch se linked hoga
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true, // Topic hamesha kisi subject se linked hoga
    },
    teacher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      default: 0, // ordering ke liye (1,2,3...)
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Ek batch ke andar same title unique ho
topicSchema.index({ title: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model("Topic", topicSchema);
