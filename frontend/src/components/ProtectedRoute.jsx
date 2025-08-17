// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
	const { user } = useAuth();

	if (!user) {
		// User not logged in, redirect to login page
		return <Navigate to="/login" replace />;
	}

	if (roles && !roles.includes(user.role)) {
		// User logged in but does not have the required role
		// You can redirect to a different page or show an access denied message
		return (
			<div className="text-center mt-8 text-lg text-red-600">
				Access Denied: You do not have permission to view this page.
			</div>
		);
	}

	// User is logged in and has the correct role (if roles are specified)
	return children;
};

export default ProtectedRoute;