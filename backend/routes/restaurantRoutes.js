// server/routes/restaurantRoutes.js
const express = require('express');
const {
	getAllRestaurants,
	getRestaurantById,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	getMyRestaurants,
	approveRestaurant,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);

// IMPORTANT: Move the specific '/my-restaurants' route BEFORE the general '/:id' route
router.route('/my-restaurants')
	.get(protect, authorizeRoles('restaurant_owner'), getMyRestaurants);

// General route for getting a single restaurant by ID (must come after specific ones)
router.get('/:id', getRestaurantById);

// Private routes for restaurant owners (other routes can stay as they are)
router.route('/')
	.post(protect, authorizeRoles('restaurant_owner'), createRestaurant);

router.route('/:id')
	.put(protect, authorizeRoles('restaurant_owner'), updateRestaurant)
	.delete(protect, authorizeRoles('restaurant_owner', 'admin'), deleteRestaurant);

module.exports = router;