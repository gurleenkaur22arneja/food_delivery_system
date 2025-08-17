const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true, // Remove whitespace from both ends of a string
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true, // Store emails in lowercase
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['customer', 'restaurant_owner', 'delivery_personnel', 'admin'], // Define possible roles
		default: 'customer', // Default role for new registrations
	},
	// Additional fields for profile, if needed
	phone: {
		type: String,
		trim: true,
	},
	address: {
		type: String,
		trim: true,
	},
}, {
	timestamps: true // Adds createdAt and updatedAt timestamps
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);