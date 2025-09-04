const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
const { protect, admin } = require('../middleware/protectMiddleware');

// User adds review
router.post('/', protect, reviewController.addReview);
router.put('/approve/:id', protect, admin, reviewController.approveReview);
router.get('/', reviewController.getApprovedReviews);
router.get('/all', reviewController.getAllReviews);
router.get('/review-details', reviewController.getApprovedReviewsStats);

module.exports = router;
