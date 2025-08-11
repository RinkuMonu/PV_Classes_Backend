const mongoose = require("mongoose");
const url = process.env.BASE_URL;
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    number: { type: String, required: true, trim: true },
    referral_code: { type: String, default: null },
    otp: { type: String, required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
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
