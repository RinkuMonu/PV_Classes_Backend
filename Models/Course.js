const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String }, // e.g. 'PYQ', 'Study Material', 'Test Series'
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  overview: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active',
    required: true
  },
  details: {
    offerings: [{ title: String, description: String }],
    books: [{ title: String, author: String, link: String }],
    faculty: [{ name: String, bio: String, avatar: String }],
    freeContent: [{ title: String, url: String, type: String }],
    faqs: [{ q: String, a: String }]
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Course', CourseSchema);
