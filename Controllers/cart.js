const Cart = require("../Models/Cart");
const Course = require("../Models/Course");
const Book = require("../Models/Book");
const PYQ = require("../Models/Pyqs");
const TestSeries = require("../Models/TestSeries");

async function getItemPrice(itemType, itemId) {
    let price = 0;
    switch (itemType) {
        case "course":
            const course = await Course.findById(itemId).select("price isFree");
            price = course?.isFree ? 0 : course?.price || 0;
            break;
        case "book":
            const book = await Book.findById(itemId).select("price");
            price = book?.price || 0;
            break;
        case "pyq":
            const pyq = await PYQ.findById(itemId).select("price isFree");
            price = pyq?.isFree ? 0 : pyq?.price || 0;
            break;
        case "testSeries":
            const ts = await TestSeries.findById(itemId).select("price isFree");
            price = ts?.isFree ? 0 : ts?.price || 0;
            break;
    }
    return price;
}

async function calculateCartTotals(cart) {
    let subtotal = 0;

    for (let item of cart.items) {
        const price = await getItemPrice(item.itemType, item.itemId);
        subtotal += price * item.quantity;
    }

    const tax = subtotal * 0.18; // 18% GST example
    const total = subtotal + tax;

    return { subtotal, tax, total };
}

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { user: userId, items: [] },
      });
    }

    // ✅ Populate with full data (virtuals auto included)
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        let productData = null;

        if (item.itemType === "course") {
          productData = await Course.findById(item.itemId).populate("exam");
        } else if (item.itemType === "book") {
          productData = await Book.findById(item.itemId).populate("book_category_id");
        } else if (item.itemType === "testSeries") {
          productData = await TestSeries.findById(item.itemId).populate("exam_id");
        } else if (item.itemType === "pyq") {
          productData = await PYQ.findById(item.itemId);
        }

        return { 
          ...item.toObject(), 
          details: productData ? productData.toJSON() : null,
         };
      })
    );

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: {
        ...cart.toObject(),
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

exports.getStorageCart = async (req, res) => {
  try {
    // parse cart data from query
    const items = JSON.parse(req.query.items || "[]");

    if (!items.length) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { items: [] },
      });
    }

    // Populate items based on type
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        let productData = null;

        if (item.itemType === "course") {
          productData = await Course.findById(item.itemId).populate("category_id");
        } else if (item.itemType === "book") {
          productData = await Book.findById(item.itemId).populate("book_category_id");
        } else if (item.itemType === "testSeries") {
          productData = await TestSeries.findById(item.itemId).populate("exam_id");
        } else if (item.itemType === "pyq") {
          productData = await PYQ.findById(item.itemId);
        }

        // productData.toJSON() => virtuals include honge
        return {
          ...item,
          details: productData ? productData.toJSON() : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: { items: populatedItems },
    });
  } catch (error) {
    console.error("Error fetching storage cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { itemType, itemId, quantity } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // find existing cart for user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // agar pehli baar user ka cart ban raha hai
      cart = new Cart({
        user: userId,
        items: [{ itemType, itemId, quantity: quantity || 1 }],
      });
    } else {
      // check if item already exists inside items
      const existingItem = cart.items.find(
        (item) =>
          item.itemType === itemType &&
          item.itemId.toString() === itemId.toString()
      );

      if (existingItem) {
        // agar item already hai to quantity badhao
        existingItem.quantity += quantity || 1;
      } else {
        // warna new item push karo
        cart.items.push({ itemType, itemId, quantity: quantity || 1 });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params; // ✅ params se lo, body se nahi

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.itemId.toString() !== itemId.toString()
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    await cart.save();
    res.status(200).json({
      success: true,
      message: "Item removed successfully",
    });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({
      success: false,
      message: "Error removing item",
      error: error.message,
    });
  }
};
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    if (!itemId || !quantity) {
      return res.status(400).json({ success: false, message: "itemId and quantity are required" });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    const item = cart.items.find(
      (it) => it.itemId.toString() === itemId.toString()
    );
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Quantity updated",
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({
      success: false,
      message: "Error updating quantity",
      error: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Find the cart first
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        if (cart.items.length > 0) {
            await Cart.deleteOne({ user: userId });
        } else {
            return res.status(200).json({ message: "Cart is already empty" });
        }
        res.status(200).json({ message: "Cart cleared and removed from DB", subtotal: 0, tax: 0, total: 0 });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};