const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !req.user.role) {
			return res.status(403).json({ message: 'Access denied. User role not found.' });
		}
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ message: `Access denied. Required role(s): ${roles.join(', ')}.` });
		}
		next();
	};
};

module.exports = { authorizeRoles };