// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
	// Initialize user from localStorage, if available
	const [user, setUser] = useState(() => {
		try {
			const storedUser = localStorage.getItem('user');
			return storedUser ? JSON.parse(storedUser) : null;
		} catch (error) {
			console.error("Failed to parse user from localStorage", error);
			return null;
		}
	});

	// Update localStorage whenever user state changes
	useEffect(() => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
	}, [user]);

	const login = (userData) => {
		setUser(userData);
	};

	const logout = () => {
		setUser(null);
		// localStorage.removeItem('user'); // This is handled by the useEffect now
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);