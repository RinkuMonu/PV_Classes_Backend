const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const CourseSchema = new Schema({
//   title: { type: String, required: true },
//   slug: { type: String, required: true },
//   exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
//   type: { type: String },
//   price: { type: Number, default: 0 },
//   isFree: { type: Boolean, default: false },
//   overview: { type: String },
//   status: { 
//     type: String, 
//     enum: ['active', 'inactive'],
//     default: 'active',
//     required: true
//   },
//   details: {
//     language: [{ type: String }], // e.g. ['Hindi', 'English']
//     offerings: [{ title: String, description: String }],
//     books: [{ title: String, author: String, link: String }],
//     faculty: [{ name: String, bio: String, avatar: String }],
//     freeContent: [{ title: String, url: String, type: String }],
//     faqs: [{ q: String, a: String }]
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Course', CourseSchema);



const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String, enum: ['Test Series', 'Course'], required: true },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  overview: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  details: {
    language: [{ type: String }],
    offerings: [
      { title: { type: String, required: true }, description: { type: String } }
    ],
    books: [
      { title: { type: String, required: true }, author: { type: String }, link: { type: String } }
    ],
    faculty: [
      { name: { type: String, required: true }, bio: { type: String }, avatar: { type: String } }
    ],
    freeContent: [
      { title: { type: String, required: true }, url: { type: String, required: true }, type: { type: String, required: true } }
    ],
    faqs: [
      { q: { type: String, required: true }, a: { type: String, required: true } }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);