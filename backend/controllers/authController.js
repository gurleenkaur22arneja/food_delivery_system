const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Helper to generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Get all delivery personnel
// @route   GET /api/auth/delivery-personnel
// @access  Private (Restaurant Owner, Admin)
const getDeliveryPersonnel = async (req, res) => {
	try {
		// Only allow restaurant owners or admins to fetch this list
		if (req.user.role !== 'restaurant_owner' && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorised to view delivery personnel list.' });
		}

		const deliveryPersonnel = await User.find({ role: 'delivery_personnel' }).select('_id name email phone');
		res.status(200).json(deliveryPersonnel);
	} catch (error) {
		console.error('Error fetching delivery personnel:', error);
		res.status(500).json({ message: 'Server error fetching delivery personnel.' });
	}
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
	const { name, email, password, role } = req.body; // Role can be passed, defaults to 'customer' in model

	try {
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'User with this email already exists.' });
		}

		const user = await User.create({
			name,
			email,
			password,
			role: role || 'customer', // Use provided role or default to customer
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				token: generateToken(user._id),
			});
		} else {
			res.status(400).json({ message: 'Invalid user data provided.' });
		}
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Server error during registration.' });
	}
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (user && (await user.matchPassword(password))) {
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				token: generateToken(user._id),
			});
		} else {
			res.status(401).json({ message: 'Invalid email or password.' });
		}
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ message: 'Server error during login.' });
	}
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select('-password'); // Exclude password
		if (user) {
			res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				phone: user.phone,
				address: user.address,
			});
		} else {
			res.status(404).json({ message: 'User not found.' });
		}
	} catch (error) {
		console.error('Get profile error:', error);
		res.status(500).json({ message: 'Server error fetching profile.' });
	}
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.phone = req.body.phone || user.phone;
			user.address = req.body.address || user.address;

			// Only update password if it's provided
			if (req.body.password) {
				user.password = req.body.password; // Pre-save hook will hash it
			}

			const updatedUser = await user.save();

			res.json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				phone: updatedUser.phone,
				address: updatedUser.address,
				token: generateToken(updatedUser._id),
			});
		} else {
			res.status(404).json({ message: 'User not found.' });
		}
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).json({ message: 'Server error updating profile.' });
	}
};

module.exports = {
	registerUser,
	loginUser,
	getProfile,
	updateUserProfile,
	getDeliveryPersonnel,
};