const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamTypeSchema = new Schema({
  name: { type: String, required: true }, // e.g. All India, Rajasthan
  slug: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
}, { timestamps: true });

ExamTypeSchema.index({ name: 1, category: 1 }, { unique: true });
module.exports = mongoose.model('ExamType', ExamTypeSchema);