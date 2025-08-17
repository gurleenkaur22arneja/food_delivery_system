const Restaurant = require('../models/Restaurant');
const User = require('../models/User'); // To check owner role

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = async (req, res) => {
	try {
		const restaurants = await Restaurant.find({ isApproved: true }).populate('owner', 'name email');
		res.status(200).json(restaurants);
	} catch (error) {
		console.error('Error fetching restaurants:', error);
		res.status(500).json({ message: 'Server error fetching restaurants.' });
	}
};

// @desc    Get a single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found.' });
		}
		res.status(200).json(restaurant);
	} catch (error) {
		console.error('Error fetching restaurant by ID:', error);
		res.status(500).json({ message: 'Server error fetching restaurant.' });
	}
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant Owner)
const createRestaurant = async (req, res) => {
	const { name, description, address, cuisineType, contactPhone, contactEmail, imageUrl } = req.body;

	// Ensure the user creating the restaurant is a restaurant owner
	if (req.user.role !== 'restaurant_owner') {
		return res.status(403).json({ message: 'Only restaurant owners can create restaurants.' });
	}

	try {
		const newRestaurant = new Restaurant({
			owner: req.user._id,
			name,
			description,
			address,
			cuisineType,
			contactPhone,
			contactEmail,
			imageUrl,
			isApproved: true, // New restaurants might need approval
		});

		const createdRestaurant = await newRestaurant.save();
		res.status(201).json(createdRestaurant);
	} catch (error) {
		console.error('Error creating restaurant:', error);
		if (error.code === 11000) { // Duplicate key error
			return res.status(400).json({ message: 'A restaurant with this name already exists.' });
		}
		res.status(500).json({ message: 'Server error creating restaurant.' });
	}
};

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Restaurant Owner of that restaurant)
const updateRestaurant = async (req, res) => {
	const { name, description, address, cuisineType, contactPhone, contactEmail, imageUrl } = req.body;

	try {
		const restaurant = await Restaurant.findById(req.params.id);

		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found.' });
		}

		// Check if the logged-in user is the owner of this restaurant
		if (restaurant.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorised to update this restaurant.' });
		}

		restaurant.name = name || restaurant.name;
		restaurant.description = description || restaurant.description;
		restaurant.address = address || restaurant.address;
		restaurant.cuisineType = cuisineType || restaurant.cuisineType;
		restaurant.contactPhone = contactPhone || restaurant.contactPhone;
		restaurant.contactEmail = contactEmail || restaurant.contactEmail;
		restaurant.imageUrl = imageUrl || restaurant.imageUrl;

		const updatedRestaurant = await restaurant.save();
		res.status(200).json(updatedRestaurant);
	} catch (error) {
		console.error('Error updating restaurant:', error);
		if (error.code === 11000) {
			return res.status(400).json({ message: 'A restaurant with this name already exists.' });
		}
		res.status(500).json({ message: 'Server error updating restaurant.' });
	}
};

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Restaurant Owner of that restaurant or Admin)
const deleteRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);

		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found.' });
		}

		// Check if the logged-in user is the owner or an admin
		if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorised to delete this restaurant.' });
		}

		await Restaurant.deleteOne({ _id: req.params.id }); // Use deleteOne for clarity
		res.status(200).json({ message: 'Restaurant removed successfully.' });
	} catch (error) {
		console.error('Error deleting restaurant:', error);
		res.status(500).json({ message: 'Server error deleting restaurant.' });
	}
};

// @desc    Get restaurants owned by the current user
// @route   GET /api/restaurants/my-restaurants
// @access  Private (Restaurant Owner)
const getMyRestaurants = async (req, res) => {
	if (req.user.role !== 'restaurant_owner') {
		return res.status(403).json({ message: 'Only restaurant owners can view their restaurants.' });
	}
	try {
		const restaurants = await Restaurant.find({ owner: req.user._id });
		res.status(200).json(restaurants);
	} catch (error) {
		console.error('Error fetching user\'s restaurants:', error);
		res.status(500).json({ message: 'Server error fetching your restaurants.' });
	}
};


module.exports = {
	getAllRestaurants,
	getRestaurantById,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	getMyRestaurants,
};