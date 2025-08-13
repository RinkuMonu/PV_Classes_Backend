const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cart");
// const auth = require("../middleware/auth");

router.get("/cart/:userId", cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.put("/update", cartController.updateQuantity);
router.post("/clear", cartController.clearCart);

module.exports = router;