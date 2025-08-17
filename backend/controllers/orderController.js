const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User'); // For delivery personnel

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
	const { restaurantId, items, deliveryAddress, paymentMethod, orderNotes, deliveryInstructions } = req.body;

	if (req.user.role !== 'customer') {
		return res.status(403).json({ message: 'Only customers can place orders.' });
	}

	try {
		const restaurant = await Restaurant.findById(restaurantId);
		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found.' });
		}

		let totalOrderPrice = 0;
		const orderItems = [];

		for (const item of items) {
			const menuItem = await MenuItem.findById(item.menuItemId);
			if (!menuItem || !menuItem.isAvailable) {
				return res.status(400).json({ message: `Menu item ${item.menuItemId} not found or unavailable.` });
			}
			if (item.quantity <= 0) {
				return res.status(400).json({ message: `Quantity for ${menuItem.name} must be at least 1.` });
			}

			orderItems.push({
				menuItem: menuItem._id,
				name: menuItem.name,
				quantity: item.quantity,
				price: menuItem.price,
			});
			totalOrderPrice += menuItem.price * item.quantity;
		}

		const newOrder = new Order({
			customer: req.user._id,
			restaurant: restaurantId,
			items: orderItems,
			totalPrice: totalOrderPrice,
			deliveryAddress,
			paymentMethod,
			orderNotes,
			deliveryInstructions,
			status: 'pending', // Initial status
			paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid', // Assuming card payments are processed immediately
		});

		const createdOrder = await newOrder.save();
		res.status(201).json(createdOrder);
	} catch (error) {
		console.error('Error creating order:', error);
		res.status(500).json({ message: 'Server error creating order.' });
	}
};

// @desc    Get all orders for the logged-in user (customer, restaurant owner, delivery personnel)
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
	try {
		let orders;
		if (req.user.role === 'customer') {
			orders = await Order.find({ customer: req.user._id })
				.populate('restaurant', 'name address')
				.populate('items.menuItem', 'name price')
				.populate('deliveryPersonnel', 'name phone')
				.sort({ createdAt: -1 });
		} else if (req.user.role === 'restaurant_owner') {
			// Find restaurants owned by this user
			const userRestaurants = await Restaurant.find({ owner: req.user._id }).select('_id');
			const restaurantIds = userRestaurants.map(r => r._id);
			orders = await Order.find({ restaurant: { $in: restaurantIds } })
				.populate('customer', 'name email phone')
				.populate('deliveryPersonnel', 'name phone')
				.populate('items.menuItem', 'name price')
				.sort({ createdAt: -1 });
		} else if (req.user.role === 'delivery_personnel') {
			orders = await Order.find({ deliveryPersonnel: req.user._id })
				.populate('customer', 'name email phone')
				.populate('restaurant', 'name address contactPhone')
				.populate('items.menuItem', 'name price')
				.sort({ createdAt: -1 });
		} else {
			return res.status(403).json({ message: 'Role not permitted to view orders this way.' });
		}
		res.status(200).json(orders);
	} catch (error) {
		console.error('Error fetching user orders:', error);
		res.status(500).json({ message: 'Server error fetching orders.' });
	}
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer, Restaurant Owner, Delivery Personnel related to order)
const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('customer', 'name email phone')
			.populate('restaurant', 'name address contactPhone')
			.populate('deliveryPersonnel', 'name phone')
			.populate('items.menuItem', 'name price');

		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}

		// Authorisation check
		const isCustomer = order.customer._id.toString() === req.user._id.toString();
		const isDeliveryPersonnel = order.deliveryPersonnel && order.deliveryPersonnel._id.toString() === req.user._id.toString();
		const restaurant = await Restaurant.findById(order.restaurant._id);
		const isRestaurantOwner = restaurant && restaurant.owner.toString() === req.user._id.toString();

		if (!isCustomer && !isDeliveryPersonnel && !isRestaurantOwner && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorised to view this order.' });
		}

		res.status(200).json(order);
	} catch (error) {
		console.error('Error fetching order by ID:', error);
		res.status(500).json({ message: 'Server error fetching order.' });
	}
};

// @desc    Update order status (Restaurant Owner, Delivery Personnel, Admin)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
	const { status, deliveryPersonnelId } = req.body;

	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}

		const restaurant = await Restaurant.findById(order.restaurant);
		if (!restaurant) {
			return res.status(404).json({ message: 'Associated restaurant not found.' });
		}

		// Authorisation logic based on role and status change
		if (req.user.role === 'restaurant_owner' && restaurant.owner.toString() === req.user._id.toString()) {
			// Restaurant owner can confirm, prepare, ready_for_pickup, reject, cancel (if pending)
			const allowedStatuses = ['confirmed', 'preparing', 'ready_for_pickup', 'rejected'];
			if (order.status === 'pending') allowedStatuses.push('cancelled'); // Can cancel if still pending
			if (!allowedStatuses.includes(status)) {
				return res.status(403).json({ message: `Restaurant owners cannot change status to '${status}'.` });
			}
			order.status = status;
			if (status === 'rejected' || status === 'cancelled') {
				order.paymentStatus = 'refunded'; // Or handle refund logic
			}
		} else if (req.user.role === 'delivery_personnel' && order.deliveryPersonnel && order.deliveryPersonnel.toString() === req.user._id.toString()) {
			// Delivery personnel can set out_for_delivery, delivered
			const allowedStatuses = ['out_for_delivery', 'delivered'];
			if (!allowedStatuses.includes(status)) {
				return res.status(403).json({ message: `Delivery personnel cannot change status to '${status}'.` });
			}
			order.status = status;
			if (status === 'delivered') {
				order.actualDeliveryTime = new Date();
			}
		} else if (req.user.role === 'admin') {
			// Admin can change to any valid status
			order.status = status;
		} else {
			return res.status(403).json({ message: 'Not authorised to update this order status.' });
		}

		// Assign delivery personnel (only if status is ready_for_pickup or confirmed and deliveryPersonnelId is provided)
		if (deliveryPersonnelId && (order.status === 'confirmed' || order.status === 'ready_for_pickup')) {
			const deliveryUser = await User.findById(deliveryPersonnelId);
			if (!deliveryUser || deliveryUser.role !== 'delivery_personnel') {
				return res.status(400).json({ message: 'Invalid delivery personnel ID provided.' });
			}
			order.deliveryPersonnel = deliveryPersonnelId;
		}

		const updatedOrder = await order.save();
		res.status(200).json(updatedOrder);
	} catch (error) {
		console.error('Error updating order status:', error);
		res.status(500).json({ message: 'Server error updating order status.' });
	}
};

// @desc    Cancel an order (Customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer)
const cancelOrder = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}

		if (order.customer.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to cancel this order.' });
		}

		// Only allow cancellation if order is pending or confirmed
		if (order.status === 'pending' || order.status === 'confirmed') {
			order.status = 'cancelled';
			order.paymentStatus = 'refunded'; // Or trigger actual refund process
			const updatedOrder = await order.save();
			res.status(200).json(updatedOrder);
		} else {
			res.status(400).json({ message: `Order cannot be cancelled at status: ${order.status}.` });
		}
	} catch (error) {
		console.error('Error cancelling order:', error);
		res.status(500).json({ message: 'Server error cancelling order.' });
	}
};

// @desc    Get orders for delivery personnel (unassigned or assigned to them)
// @route   GET /api/orders/delivery-queue
// @access  Private (Delivery Personnel)
const getDeliveryQueue = async (req, res) => {
	if (req.user.role !== 'delivery_personnel') {
		return res.status(403).json({ message: 'Access denied. Only delivery personnel can view the delivery queue.' });
	}
	try {
		const orders = await Order.find({
				$or: [
					{ status: 'ready_for_pickup', deliveryPersonnel: null }, // Unassigned, ready for pickup
					{ deliveryPersonnel: req.user._id, status: { $in: ['out_for_delivery', 'ready_for_pickup'] } } // Assigned to current user
				]
			})
			.populate('customer', 'name phone address')
			.populate('restaurant', 'name address contactPhone')
			.populate('deliveryPersonnel', 'name phone')
			.sort({ createdAt: 1 }); // Oldest first
		res.status(200).json(orders);
	} catch (error) {
		console.error('Error fetching delivery queue:', error);
		res.status(500).json({ message: 'Server error fetching delivery queue.' });
	}
};

// @desc    Assign an order to a delivery personnel
// @route   PUT /api/orders/:id/assign-delivery
// @access  Private (Restaurant Owner, Admin)
const assignDeliveryPersonnel = async (req, res) => {
	const { deliveryPersonnelId } = req.body;
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}

		const restaurant = await Restaurant.findById(order.restaurant);
		if (!restaurant) {
			return res.status(404).json({ message: 'Associated restaurant not found.' });
		}

		// Authorisation: Only restaurant owner of this order's restaurant or admin can assign
		if (req.user.role === 'restaurant_owner' && restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorised to assign delivery for this order.' });
		}

		const deliveryUser = await User.findById(deliveryPersonnelId);
		if (!deliveryUser || deliveryUser.role !== 'delivery_personnel') {
			return res.status(400).json({ message: 'Invalid delivery personnel ID provided.' });
		}

		order.deliveryPersonnel = deliveryPersonnelId;
		// Optionally update status if it's ready for pickup and not yet assigned
		if (order.status === 'ready_for_pickup' && !order.deliveryPersonnel) {
			// We can keep it ready_for_pickup, or change to 'assigned_for_delivery' if we add that status
		}

		const updatedOrder = await order.save();
		res.status(200).json(updatedOrder);
	} catch (error) {
		console.error('Error assigning delivery personnel:', error);
		res.status(500).json({ message: 'Server error assigning delivery personnel.' });
	}
};


module.exports = {
	createOrder,
	getMyOrders,
	getOrderById,
	updateOrderStatus,
	cancelOrder,
	getDeliveryQueue,
	assignDeliveryPersonnel,
};