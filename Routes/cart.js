const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cart");
const auth = require("../middleware/auth");

router.get("/",auth, cartController.getCart);
router.post("/add",auth, cartController.addToCart);
router.delete("/remove/:itemId",auth, cartController.removeFromCart);
router.put("/update",auth, cartController.updateQuantity);
router.delete("/clear",auth, cartController.clearCart);

module.exports = router;