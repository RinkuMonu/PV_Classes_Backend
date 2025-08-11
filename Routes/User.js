const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getOtp,
    loginUser,
    updateUser,
    getUserData
} = require("../Controllers/userController");

router.post("/get-otp", getOtp);
router.post("/login", loginUser);
router.get("/getUser",auth, getUserData);
const path = require("path");

router.put(
  "/updateUser",
  auth,
  (req, res, next) => {
    req.subFolder = "profile_image"; // Yeh folder uploads ke andar banega
    next();
  },
  upload.single("profile_image"),
  updateUser
);


module.exports = router;
