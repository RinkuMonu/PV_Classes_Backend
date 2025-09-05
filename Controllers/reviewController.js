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

exports.getApprovedReviewsStats = async (req, res) => {
  try {
    // Aggregate reviews by course
    const courseStats = await Review.aggregate([
      { $match: { approved: true, course: { $ne: null } } }, // only approved and course reviews
      {
        $group: {
          _id: "$course",
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "courses",        // collection name of courses
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 0,
          courseId: "$course._id",
          courseTitle: "$course.title",
          totalReviews: 1,
          averageRating: { $round: ["$averageRating", 2] }, // round to 2 decimals
        },
      },
    ]);

    // Aggregate reviews by coaching
    const coachingStats = await Review.aggregate([
      { $match: { approved: true, coaching: { $ne: null } } }, // only approved and coaching reviews
      {
        $group: {
          _id: "$coaching",
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "coachings",        // collection name of coachings
          localField: "_id",
          foreignField: "_id",
          as: "coaching",
        },
      },
      { $unwind: "$coaching" },
      {
        $project: {
          _id: 0,
          coachingId: "$coaching._id",
          coachingName: "$coaching.name",
          totalReviews: 1,
          averageRating: { $round: ["$averageRating", 2] },
        },
      },
    ]);

    res.json({ courseStats, coachingStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('course', 'title')
      .populate('coaching', 'name')
      .sort({ createdAt: -1 }); // latest first

    res.json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
