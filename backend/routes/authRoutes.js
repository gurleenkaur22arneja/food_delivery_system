const express = require('express');
const { registerUser, loginUser, getProfile, updateUserProfile, getDeliveryPersonnel } = require('../controllers/authController'); // <--- ADD getDeliveryPersonnel HERE
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getProfile).put(protect, updateUserProfile);

// New route to get delivery personnel list
router.get('/delivery-personnel', protect, authorizeRoles('restaurant_owner', 'admin'), getDeliveryPersonnel);

module.exports = router;