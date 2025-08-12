const mongoose = require("mongoose");

const CurrentAffairCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("CurrentAffairCategory", CurrentAffairCategorySchema);
