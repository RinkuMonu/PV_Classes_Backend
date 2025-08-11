const express = require("express");
const router = express.Router();
const wishlistController = require("../Controllers/wishlist.js");
const verifyToken = require("../middleware/auth");

// Add to wishlist
router.post("/", verifyToken, wishlistController.addToWishlist);

// Get wishlist
router.get("/", verifyToken, wishlistController.getWishlist);

// Remove from wishlist
router.delete("/:courseId", verifyToken, wishlistController.removeFromWishlist);

module.exports = router;
