// client/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const response = await axiosInstance.post('/api/auth/login', formData);
			login(response.data);
			// Redirect based on role
			if (response.data.role === 'restaurant_owner') {
				navigate('/owner/dashboard');
			} else if (response.data.role === 'delivery_personnel') {
				navigate('/delivery/dashboard');
			} else {
				navigate('/restaurants'); // Default for customer
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
				{error && <p className="text-red-500 text-center mb-4">{error}</p>}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="your.email@example.com"
							value={formData.email}
							onChange={handleChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="********"
							value={formData.password}
							onChange={handleChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
						>
							Sign In
						</button>
					</div>
				</form>
				<p className="text-center text-gray-600 text-sm mt-4">
					Don't have an account? <a href="/frontend/src/pages/RegisterPage" className="text-orange-500 hover:text-orange-600 font-bold">Register here</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;