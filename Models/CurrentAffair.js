const mongoose = require("mongoose");

const CurrentAffairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "CurrentAffairCategory", required: true },
  image: { type: String },
  tags: [{ type: String }],
  publishDate: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true });

CurrentAffairSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("CurrentAffair", CurrentAffairSchema);
