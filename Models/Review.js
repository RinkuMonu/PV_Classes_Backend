const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Kis cheez ka review hai (Course ya Coaching)
  reviewType: { 
    type: String, 
    enum: ['course', 'coaching'], 
    required: true 
  },

  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  coaching: { type: Schema.Types.ObjectId, ref: 'Coaching' },

  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },

  comment: { type: String, trim: true },

  approved: { type: Boolean, default: false } // Admin approve karega

}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
