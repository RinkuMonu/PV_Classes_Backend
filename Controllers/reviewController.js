const Review = require('../Models/Review');

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { reviewType, course, coaching, rating, comment } = req.body;

    // Validation
    if (!['course', 'coaching'].includes(reviewType)) {
      return res.status(400).json({ message: "Invalid review type" });
    }

    if (reviewType === 'course' && !course) {
      return res.status(400).json({ message: "Course ID required" });
    }

    if (reviewType === 'coaching' && !coaching) {
      return res.status(400).json({ message: "Coaching ID required" });
    }

    const review = new Review({
      user: req.user._id, // Assuming auth middleware sets req.user
      reviewType,
      course,
      coaching,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ message: "Review submitted for approval", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Review
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review approved", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Reviews (Only approved)
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .populate('user', 'name')
      .populate('course', 'title')
      .populate('coaching', 'name');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
