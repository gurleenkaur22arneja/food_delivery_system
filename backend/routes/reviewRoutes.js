const express = require('express');
const {
	submitReview,
	getReviewsByRestaurant,
	getMyReviews,
	getReviewById,
	updateReview,
	deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();

// Customer routes
router.post('/', protect, authorizeRoles('customer'), submitReview);
router.get('/my-reviews', protect, authorizeRoles('customer'), getMyReviews);
router.put('/:id', protect, authorizeRoles('customer'), updateReview);
router.delete('/:id', protect, authorizeRoles('customer', 'admin'), deleteReview); // Admin can also delete

// Public routes
router.get('/restaurant/:restaurantId', getReviewsByRestaurant);
router.get('/:id', getReviewById);

module.exports = router;