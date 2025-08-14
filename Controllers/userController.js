const User = require("../Models/User"); 
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // optional for randomness

exports.getOtp = async (req, res) => {
  try {
    const { phone, referral_code } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000); // integer OTP

    // Build update data
    const updateData = { phone, otp };
    if (referral_code) updateData.referral_code = referral_code;

    // Update or create user
    const user = await User.findOneAndUpdate(
      { phone },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "OTP sent successfully",
      data: {
        phone: user.phone,
        referral_code: user.referral_code || null,
        otp
      }
    });

  } catch (error) {
    console.error("Get OTP Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log("req.body =",req.body);
    if (!phone || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry && user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      userId:user._id
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
    const { name, email, state, district } = req.body; // form-data text fields
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (state) updateData.state = state;
    if (district) updateData.district = district;

    // Agar file aayi hai to multer se path save karo
    if (req.file) {
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/profile_image/${req.file.filename}`;
        updateData.profile_image = req.file.filename;
        updateData.profile_image_url = fileUrl;
    }


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
exports.getAllUserData = async (req, res) => {
  try {
    const users = await User.find(); // fetch all users
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.body; // or req.params.userId if you want

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle status
    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    return res.status(200).json({
      message: `User status updated to ${user.status}`,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};