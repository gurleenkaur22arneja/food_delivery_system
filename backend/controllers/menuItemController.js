const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get all menu items for a specific restaurant
// @route   GET /api/restaurants/:restaurantId/menu
// @access  Public
const getMenuItemsByRestaurant = async (req, res) => {
	try {
		const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
		res.status(200).json(menuItems);
	} catch (error) {
		console.error('Error fetching menu items:', error);
		res.status(500).json({ message: 'Server error fetching menu items.' });
	}
};

// @desc    Get a single menu item by ID
// @route   GET /api/menu-items/:id
// @access  Public
const getMenuItemById = async (req, res) => {
	try {
		const menuItem = await MenuItem.findById(req.params.id);
		if (!menuItem) {
			return res.status(404).json({ message: 'Menu item not found.' });
		}
		res.status(200).json(menuItem);
	} catch (error) {
		console.error('Error fetching menu item by ID:', error);
		res.status(500).json({ message: 'Server error fetching menu item.' });
	}
};

// @desc    Create a new menu item for a restaurant
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (Restaurant Owner of that restaurant)
const createMenuItem = async (req, res) => {
	const { name, description, price, category, imageUrl, isAvailable } = req.body;
	const { restaurantId } = req.params;

	try {
		const restaurant = await Restaurant.findById(restaurantId);
		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found.' });
		}

		// Check if the logged-in user is the owner of this restaurant
		if (restaurant.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to add menu items to this restaurant.' });
		}

		const newMenuItem = new MenuItem({
			restaurant: restaurantId,
			name,
			description,
			price,
			category,
			imageUrl,
			isAvailable: isAvailable !== undefined ? isAvailable : true,
		});

		const createdMenuItem = await newMenuItem.save();
		res.status(201).json(createdMenuItem);
	} catch (error) {
		console.error('Error creating menu item:', error);
		res.status(500).json({ message: 'Server error creating menu item.' });
	}
};

// @desc    Update a menu item
// @route   PUT /api/menu-items/:id
// @access  Private (Restaurant Owner of the item's restaurant)
const updateMenuItem = async (req, res) => {
	const { name, description, price, category, imageUrl, isAvailable } = req.body;

	try {
		const menuItem = await MenuItem.findById(req.params.id);
		if (!menuItem) {
			return res.status(404).json({ message: 'Menu item not found.' });
		}

		const restaurant = await Restaurant.findById(menuItem.restaurant);
		if (!restaurant) {
			return res.status(404).json({ message: 'Associated restaurant not found.' });
		}

		// Check if the logged-in user is the owner of this restaurant
		if (restaurant.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to update this menu item.' });
		}

		menuItem.name = name || menuItem.name;
		menuItem.description = description || menuItem.description;
		menuItem.price = price !== undefined ? price : menuItem.price;
		menuItem.category = category || menuItem.category;
		menuItem.imageUrl = imageUrl || menuItem.imageUrl;
		menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;

		const updatedMenuItem = await menuItem.save();
		res.status(200).json(updatedMenuItem);
	} catch (error) {
		console.error('Error updating menu item:', error);
		res.status(500).json({ message: 'Server error updating menu item.' });
	}
};

// @desc    Delete a menu item
// @route   DELETE /api/menu-items/:id
// @access  Private (Restaurant Owner of the item's restaurant)
const deleteMenuItem = async (req, res) => {
	try {
		const menuItem = await MenuItem.findById(req.params.id);
		if (!menuItem) {
			return res.status(404).json({ message: 'Menu item not found.' });
		}

		const restaurant = await Restaurant.findById(menuItem.restaurant);
		if (!restaurant) {
			return res.status(404).json({ message: 'Associated restaurant not found.' });
		}

		// Check if the logged-in user is the owner of this restaurant
		if (restaurant.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to delete this menu item.' });
		}

		await MenuItem.deleteOne({ _id: req.params.id });
		res.status(200).json({ message: 'Menu item removed successfully.' });
	} catch (error) {
		console.error('Error deleting menu item:', error);
		res.status(500).json({ message: 'Server error deleting menu item.' });
	}
};

module.exports = {
	getMenuItemsByRestaurant,
	getMenuItemById,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
};