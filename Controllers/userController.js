const User = require("../Models/User"); 
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // optional for randomness

exports.getOtp = async (req, res) => {
  try {
    const { number, referral_code } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const user = await User.findOne({ number });
    if (!user) {
      return res.status(404).json({ message: "User not found with this phone number" });
    }
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    user.otp = otp;
    if (referral_code) {
      user.referral_code = referral_code;
    }
    await user.save();
    res.status(200).json({
      message: "OTP sent successfully",
      data: {
        number: user.number,
        referral_code: user.referral_code || null,
        otp: otp 
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry && user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      redirect: "/dashboard"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data fetched successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { name, email, state, district, profile_image } = req.body;
    const userId = req.user.id;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (state) updateData.state = state;
    if (district) updateData.district = district;
    if (profile_image) updateData.profile_image = profile_image;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};