const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
	menuItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MenuItem',
		required: true,
	},
	name: { type: String, required: true }, // Snapshot of item name at time of order
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	price: { type: Number, required: true }, // Snapshot of item price at time of order
});

const orderSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true,
	},
	deliveryPersonnel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null, // Assigned later
	},
	items: [orderItemSchema],
	totalPrice: {
		type: Number,
		required: true,
		min: 0,
	},
	deliveryAddress: {
		street: { type: String, required: true, trim: true },
		city: { type: String, required: true, trim: true },
		state: { type: String, required: true, trim: true },
		zipCode: { type: String, required: true, trim: true },
		country: { type: String, default: 'Australia', trim: true },
	},
	status: {
		type: String,
		enum: [
			'pending',        // Order placed, awaiting restaurant confirmation
			'confirmed',      // Restaurant confirmed, preparing food
			'preparing',      // Food being prepared
			'ready_for_pickup', // Food ready for delivery personnel
			'out_for_delivery', // Delivery personnel picked up
			'delivered',      // Order successfully delivered
			'cancelled',      // Order cancelled by customer or restaurant
			'rejected'        // Restaurant rejected the order
		],
		default: 'pending',
	},
	paymentMethod: {
		type: String,
		enum: ['card', 'cash_on_delivery'],
		default: 'card',
	},
	paymentStatus: {
		type: String,
		enum: ['pending', 'paid', 'refunded'],
		default: 'pending',
	},
	orderNotes: {
		type: String,
		trim: true,
	},
	deliveryInstructions: {
		type: String,
		trim: true,
	},
	estimatedDeliveryTime: {
		type: Date,
	},
	actualDeliveryTime: {
		type: Date,
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);