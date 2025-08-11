const express = require("express");
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
router.put("/updateUser",auth, updateUser);

module.exports = router;
