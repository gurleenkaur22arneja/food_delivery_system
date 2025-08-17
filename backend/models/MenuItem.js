const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	category: {
		type: String, // e.g., 'Appetizer', 'Main Course', 'Dessert', 'Drink'
		required: true,
		trim: true,
	},
	imageUrl: {
		type: String, // URL to item's image
		default: 'https://via.placeholder.com/100', // Placeholder image
	},
	isAvailable: {
		type: Boolean,
		default: true,
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);