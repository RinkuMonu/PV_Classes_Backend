const mongoose = require("mongoose");
const url = process.env.BASE_URL;
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, trim: true },
    email: { type: String, required: false, lowercase: true, trim: true },
    number: { type: String, required: true, trim: true },
    referral_code: { type: String, default: null },
    otp: { type: Number, required: false },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: false },
    state: { type: String, required: false },
    district: { type: String, required: false },
    profile_image: { type: String, default: null },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // JSON me virtual fields show karne ke liye
    toObject: { virtuals: true }
  }
);

// Virtual field for full profile image URL
UserSchema.virtual("profile_image_url").get(function () {
  if (this.profile_image) {
    return `${process.env.BASE_URL}/uploads/${this.profile_image}`;
  }
  return null;
});

module.exports = mongoose.model("User", UserSchema);
