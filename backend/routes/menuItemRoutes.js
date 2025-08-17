const express = require('express');
const {
	getMenuItemsByRestaurant,
	getMenuItemById,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
} = require('../controllers/menuItemController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();

// Public route to get menu items for a restaurant
router.get('/restaurants/:restaurantId/menu', getMenuItemsByRestaurant);
router.get('/:id', getMenuItemById); // Get single menu item by its ID

// Private routes for restaurant owners
router.post('/restaurants/:restaurantId/menu', protect, authorizeRoles('restaurant_owner'), createMenuItem);
router.put('/:id', protect, authorizeRoles('restaurant_owner'), updateMenuItem);
router.delete('/:id', protect, authorizeRoles('restaurant_owner'), deleteMenuItem);

module.exports = router;