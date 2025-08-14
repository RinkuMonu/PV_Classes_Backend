const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  url: { type: String, required: true },  
  description: { type: String },           
  duration: { type: Number },             
  order: { type: Number, required: true }, 
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String, enum: ['Test Series', 'Course'], required: true },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  overview: { type: String },
  image: { type: String },
  videos: [VideoSchema], 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
