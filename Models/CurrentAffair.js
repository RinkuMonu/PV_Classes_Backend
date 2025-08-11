const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrentAffairSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  content: { type: String, required: true }, // HTML or plain text
  image: { type: String },
  pdfLink: { type: String },
  videoLink: { type: String },
  publishedAt: { type: Date, default: Date.now },
  author: { type: String, default: 'Utkarsh Team' }
}, { timestamps: true });

module.exports = mongoose.model('CurrentAffair', CurrentAffairSchema);
