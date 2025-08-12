const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  name: { type: String, required: true }, // e.g. 3rd Grade
  slug: { type: String, required: true },
  examType: { type: Schema.Types.ObjectId, ref: 'ExamType', required: true },
  description: { type: String },
  logo: { type: String }, // exam logo image path
}, { timestamps: true });

ExamSchema.index({ name: 1, examType: 1 }, { unique: false });

module.exports = mongoose.model('Exam', ExamSchema);
