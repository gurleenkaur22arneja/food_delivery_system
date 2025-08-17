const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// Helper function to update restaurant average rating
const updateRestaurantRating = async (restaurantId) => {
	const reviews = await Review.find({ restaurant: restaurantId });
	if (reviews.length > 0) {
		const totalRating = reviews.reduce((acc, review) => acc + review.restaurantRating, 0);
		const averageRating = totalRating / reviews.length;
		await Restaurant.findByIdAndUpdate(restaurantId, {
			averageRating: averageRating.toFixed(1), // Round to one decimal place
			reviewCount: reviews.length,
		});
	} else {
		await Restaurant.findByIdAndUpdate(restaurantId, {
			averageRating: 0,
			reviewCount: 0,
		});
	}
};

// @desc    Submit a new review for an order
// @route   POST /api/reviews
// @access  Private (Customer)
const submitReview = async (req, res) => {
	const { orderId, restaurantRating, restaurantComment, deliveryRating, deliveryComment } = req.body;

	if (req.user.role !== 'customer') {
		return res.status(403).json({ message: 'Only customers can submit reviews.' });
	}

	try {
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}
		if (order.customer.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to review this order.' });
		}
		if (order.status !== 'delivered') {
			return res.status(400).json({ message: 'Only delivered orders can be reviewed.' });
		}

		// Check if a review already exists for this order by this customer
		const existingReview = await Review.findOne({ order: orderId, customer: req.user._id });
		if (existingReview) {
			return res.status(400).json({ message: 'You have already reviewed this order.' });
		}

		const newReview = new Review({
			customer: req.user._id,
			order: orderId,
			restaurant: order.restaurant,
			deliveryPersonnel: order.deliveryPersonnel,
			restaurantRating,
			restaurantComment,
			deliveryRating,
			deliveryComment,
		});

		const createdReview = await newReview.save();

		// Update restaurant's average rating
		await updateRestaurantRating(order.restaurant);

		res.status(201).json(createdReview);
	} catch (error) {
		console.error('Error submitting review:', error);
		res.status(500).json({ message: 'Server error submitting review.' });
	}
};

// @desc    Get reviews for a specific restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
const getReviewsByRestaurant = async (req, res) => {
	try {
		const reviews = await Review.find({ restaurant: req.params.restaurantId })
			.populate('customer', 'name')
			.sort({ createdAt: -1 });
		res.status(200).json(reviews);
	} catch (error) {
		console.error('Error fetching restaurant reviews:', error);
		res.status(500).json({ message: 'Server error fetching restaurant reviews.' });
	}
};

// @desc    Get reviews by a specific customer
// @route   GET /api/reviews/my-reviews
// @access  Private (Customer)
const getMyReviews = async (req, res) => {
	try {
		const reviews = await Review.find({ customer: req.user._id })
			.populate('restaurant', 'name')
			.populate('order', 'totalPrice')
			.populate('deliveryPersonnel', 'name')
			.sort({ createdAt: -1 });
		res.status(200).json(reviews);
	} catch (error) {
		console.error('Error fetching user reviews:', error);
		res.status(500).json({ message: 'Server error fetching your reviews.' });
	}
};

// @desc    Get a single review by ID
// @route   GET /api/reviews/:id
// @access  Public (or Private if sensitive)
const getReviewById = async (req, res) => {
	try {
		const review = await Review.findById(req.params.id)
			.populate('customer', 'name')
			.populate('restaurant', 'name')
			.populate('order', 'totalPrice')
			.populate('deliveryPersonnel', 'name');
		if (!review) {
			return res.status(404).json({ message: 'Review not found.' });
		}
		res.status(200).json(review);
	} catch (error) {
		console.error('Error fetching review by ID:', error);
		res.status(500).json({ message: 'Server error fetching review.' });
	}
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Customer who created the review)
const updateReview = async (req, res) => {
	const { restaurantRating, restaurantComment, deliveryRating, deliveryComment } = req.body;
	try {
		const review = await Review.findById(req.params.id);
		if (!review) {
			return res.status(404).json({ message: 'Review not found.' });
		}
		if (review.customer.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to update this review.' });
		}

		review.restaurantRating = restaurantRating !== undefined ? restaurantRating : review.restaurantRating;
		review.restaurantComment = restaurantComment !== undefined ? restaurantComment : review.restaurantComment;
		review.deliveryRating = deliveryRating !== undefined ? deliveryRating : review.deliveryRating;
		review.deliveryComment = deliveryComment !== undefined ? deliveryComment : review.deliveryComment;

		const updatedReview = await review.save();
		await updateRestaurantRating(review.restaurant); // Recalculate average
		res.status(200).json(updatedReview);
	} catch (error) {
		console.error('Error updating review:', error);
		res.status(500).json({ message: 'Server error updating review.' });
	}
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Customer who created the review or Admin)
const deleteReview = async (req, res) => {
	try {
		const review = await Review.findById(req.params.id);
		if (!review) {
			return res.status(404).json({ message: 'Review not found.' });
		}
		if (review.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorised to delete this review.' });
		}

		const restaurantId = review.restaurant;
		await Review.deleteOne({ _id: req.params.id });
		await updateRestaurantRating(restaurantId); // Recalculate average
		res.status(200).json({ message: 'Review removed successfully.' });
	} catch (error) {
		console.error('Error deleting review:', error);
		res.status(500).json({ message: 'Server error deleting review.' });
	}
};

module.exports = {
	submitReview,
	getReviewsByRestaurant,
	getMyReviews,
	getReviewById,
	updateReview,
	deleteReview,
};