// server/routes/orderRoutes.js
const express = require('express');
const {
	createOrder,
	getMyOrders,
	getOrderById,
	updateOrderStatus,
	cancelOrder,
	getDeliveryQueue,
	assignDeliveryPersonnel,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();

// Customer routes
router.post('/', protect, authorizeRoles('customer'), createOrder);
router.put('/:id/cancel', protect, authorizeRoles('customer'), cancelOrder);

// General order viewing (customer, owner, delivery personnel)
router.get('/my-orders', protect, getMyOrders);

// IMPORTANT: Move the specific '/delivery-queue' route BEFORE the general '/:id' route
// Delivery personnel specific routes
router.get('/delivery-queue', protect, authorizeRoles('delivery_personnel'), getDeliveryQueue);


// General route for getting a single order by ID (must come after specific ones)
router.get('/:id', protect, getOrderById);


// Restaurant owner / Admin routes for status updates and assignment
router.put('/:id/status', protect, authorizeRoles('restaurant_owner', 'delivery_personnel', 'admin'), updateOrderStatus);
router.put('/:id/assign-delivery', protect, authorizeRoles('restaurant_owner', 'admin'), assignDeliveryPersonnel);


module.exports = router;