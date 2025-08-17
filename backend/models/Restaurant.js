const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true, // Restaurant names should ideally be unique
	},
	description: {
		type: String,
		trim: true,
	},
	address: {
		street: { type: String, required: true, trim: true },
		city: { type: String, required: true, trim: true },
		state: { type: String, required: true, trim: true },
		zipCode: { type: String, required: true, trim: true },
		country: { type: String, default: 'Australia', trim: true },
	},
	cuisineType: {
		type: [String], // e.g., ['Italian', 'Indian', 'Mexican']
		required: true,
	},
	contactPhone: {
		type: String,
		trim: true,
	},
	contactEmail: {
		type: String,
		trim: true,
		lowercase: true,
	},
	imageUrl: {
		type: String, // URL to restaurant's main image
		default: 'https://via.placeholder.com/150', // Placeholder image
	},
	isApproved: {
		type: Boolean,
		default: true, // Might need admin approval
	},
	averageRating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5,
	},
	reviewCount: {
		type: Number,
		default: 0,
	}
}, {
	timestamps: true,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);