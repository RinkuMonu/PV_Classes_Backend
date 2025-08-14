const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String, enum: ['Test Series', 'Course'], required: true },
  price: { type: Number, default: 0 },
  discount_price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  validity:{type:String},
  overview: { type: String },
  images: [{ type: String }], 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

CourseSchema.virtual('imagesFullPath').get(function () {
  if (!this.images) return [];
  return this.images.map(img => `${process.env.BASE_URL}/uploads/course/${img}`);
});
CourseSchema.set('toJSON', { virtuals: true });
CourseSchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('Course', CourseSchema);