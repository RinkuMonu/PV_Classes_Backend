const Wishlist = require("../Models/wishlist");

// Add course to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, courses: [courseId] });
        } else {
            if (wishlist.courses.includes(courseId)) {
                return res.status(400).json({ message: "Course already in wishlist" });
            }
            wishlist.courses.push(courseId);
        }

        await wishlist.save();
        res.status(200).json({ message: "Course added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Error adding to wishlist", error: error.message });
    }
};

// Get wishlist for user
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate("courses");

        if (!wishlist) {
            return res.status(200).json({ courses: [] });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wishlist", error: error.message });
    }
};

// Remove course from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { courseId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.courses = wishlist.courses.filter(
            (id) => id.toString() !== courseId
        );

        await wishlist.save();
        res.status(200).json({ message: "Course removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Error removing from wishlist", error: error.message });
    }
};
