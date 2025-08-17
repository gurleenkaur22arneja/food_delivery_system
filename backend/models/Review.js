const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
		unique: true, // One review per order
	},
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true,
	},
	deliveryPersonnel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null,
	},
	restaurantRating: {
		type: Number,
		min: 1,
		max: 5,
		required: true,
	},
	restaurantComment: {
		type: String,
		trim: true,
	},
	deliveryRating: {
		type: Number,
		min: 1,
		max: 5,
	},
	deliveryComment: {
		type: String,
		trim: true,
	},
}, {
	timestamps: true,
});

// Index to ensure a customer can only review a specific order once
reviewSchema.index({ customer: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);