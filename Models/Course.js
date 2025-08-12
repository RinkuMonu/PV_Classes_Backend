const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String, enum: ['Test Series', 'Course'], required: true },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  overview: { type: String },
  image: { type: String }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);