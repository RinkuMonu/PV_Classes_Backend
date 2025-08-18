const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, default: null }, // null allowed, no unique constraint
    phone: { type: String, required: true, trim: true },
    referral_code: { type: String, default: null },
    otp: { type: Number },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "CourseCategory" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    state: { type: String },
    district: { type: String },
    profile_image: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "teacher", "admin"],
      default: "user"
    },
    experience: { type: String },
    specialization: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

UserSchema.virtual("profile_image_url").get(function () {
  if (this.profile_image) {
    return `${process.env.BASE_URL}/uploads/${this.profile_image}`;
  }
  return null;
});

module.exports = mongoose.model("User", UserSchema);
