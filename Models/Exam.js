const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  name: { type: String, required: true }, // e.g. 3rd Grade
  slug: { type: String, required: true },
  examType: { type: Schema.Types.ObjectId, ref: 'ExamType', required: true },
  description: { type: String },
  logo: { type: String }, // exam logo ka image URL
}, { timestamps: true });

ExamSchema.index({ name: 1, examType: 1 }, { unique: true });

module.exports = mongoose.model('Exam', ExamSchema);
