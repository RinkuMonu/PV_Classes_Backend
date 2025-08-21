const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // optional for randomness
const Order = require("../Models/Order");
const axios = require("axios");

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save or update user with OTP only
    await User.findOneAndUpdate(
      { phone },
      { phone, otp },
      { upsert: true, new: true }
    );

    // Send OTP using Fast2SMS
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: `Your OTP is ${otp}`,
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
      }
    );

    res.status(200).json({
      message: "OTP sent successfully",
      response: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log("req.body =", req.body);

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
      userId: user._id
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
    const { name, email, phone,address,city,state,pincode} = req.body; // form-data text fields
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (pincode) updateData.pincode = pincode;
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

// exports.getMyPurchases = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const orders = await Order.find({
//       user: userId,
//       orderStatus: "completed"
//     })
//       .populate("courses.course")
//       .populate("books.book")
//       .populate("testSeries.test")
//       .sort({ createdAt: -1 });

//     const purchasedCourses = [];
//     const purchasedBooks = [];
//     const purchasedTestSeries = [];

//     orders.forEach(order => {
//       // 🟢 Courses
//       order.courses.forEach(c => {
//         if (c.course) {
//           purchasedCourses.push(
//             c.course
//           );
//         }
//       });

//       // 🟢 Books
//       order.books.forEach(b => {
//         if (b.book) {
//           purchasedBooks.push(
//             b.book
//           );
//         }
//       });

//       // 🟢 Test Series
//       order.testSeries.forEach(t => {
//         if (t.test) {
//           purchasedTestSeries.push(
//             t.test
//           );
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       items: { purchasedCourses, purchasedBooks, purchasedTestSeries }
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      user: userId,
      orderStatus: "completed"
    })
      .populate({
        path: "courses.course",
        populate: { path: "comboId", populate: ["books", "testSeries","pyqs"] } // ✅ combo ke andar books aur test series bhi
        
      })
      .populate("books.book")
      .populate("testSeries.test")
      .sort({ createdAt: -1 });

    const purchasedCourses = [];
    const purchasedBooks = [];
    const purchasedTestSeries = [];

    orders.forEach(order => {
      // 🟢 Courses
      order.courses.forEach(c => {
        if (c.course) {
          purchasedCourses.push(c.course);

          // ✅ Agar course me combo hai to uske items bhi add karo
          if (c.course.comboId) {
            const combo = c.course.comboId;

            // Combo books
            if (combo.books?.length > 0) {
              combo.books.forEach(b => {
                if (b) purchasedBooks.push(b);
              });
            }

            // Combo testSeries
            if (combo.testSeries?.length > 0) {
              combo.testSeries.forEach(t => {
                if (t) purchasedTestSeries.push(t);
              });
            }
          }
        }
      });

      // 🟢 Standalone Books
      order.books.forEach(b => {
        if (b.book) purchasedBooks.push(b.book);
      });

      // 🟢 Standalone Test Series
      order.testSeries.forEach(t => {
        if (t.test) purchasedTestSeries.push(t.test);
      });
    });

    res.status(200).json({
      success: true,
      items: { purchasedCourses, purchasedBooks, purchasedTestSeries }
    });

  } catch (error) {
    console.error("❌ Error in getMyPurchases:", error);
    res.status(500).json({ error: error.message });
  }
};
