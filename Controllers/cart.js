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
        const { userId } = req.params; // ✅ using params now
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(200).json({ 
                user: userId, 
                items: [], 
                subtotal: 0, 
                tax: 0, 
                total: 0 
            });
        }

        const totals = await calculateCartTotals(cart);

        res.status(200).json({
            ...cart.toObject(),
            ...totals
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { userId, itemType, itemId, quantity, extra } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.itemType === itemType && item.itemId.toString() === itemId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ itemType, itemId, quantity: quantity || 1, extra });
        }

        await cart.save();
        const totals = await calculateCartTotals(cart);

        res.status(200).json({ message: "Item added to cart", cart, ...totals });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, itemType, itemId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            item => !(item.itemType === itemType && item.itemId.toString() === itemId)
        );

        await cart.save();
        const totals = await calculateCartTotals(cart);

        res.status(200).json({ message: "Item removed", cart, ...totals });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: error.message });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { userId, itemType, itemId, quantity } = req.body; // added userId in body
        let cart = await Cart.findOne({ user: userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            item => item.itemType === itemType && item.itemId.toString() === itemId
        );
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = quantity;
        await cart.save();
        const totals = await calculateCartTotals(cart);

        res.status(200).json({ message: "Quantity updated", cart, ...totals });
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity", error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the cart first
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // If there are items, remove them; if already empty, delete cart
        if (cart.items.length > 0) {
            await Cart.deleteOne({ user: userId }); // delete the entire cart
        } else {
            return res.status(200).json({ message: "Cart is already empty" });
        }

        res.status(200).json({ message: "Cart cleared and removed from DB", subtotal: 0, tax: 0, total: 0 });

    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};