// client/src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ProfilePage = () => {
	const { user, login } = useAuth(); // Use login to update context after profile update
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
		password: '', // For password change
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user) {
				setLoading(false);
				return;
			}
			try {
				const response = await axiosInstance.get('/api/auth/profile', {
					headers: { Authorization: `Bearer ${user.token}` },
				});
				setFormData({
					name: response.data.name || '',
					email: response.data.email || '',
					phone: response.data.phone || '',
					address: response.data.address || '',
					password: '', // Password field should always be empty initially
				});
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to fetch profile.');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [user]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');
		try {
			const updateData = { ...formData };
			// Only send password if it's not empty
			if (!updateData.password) {
				delete updateData.password;
			}

			const response = await axiosInstance.put('/api/auth/profile', updateData, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			login(response.data); // Update user context with new token/data
			setSuccess('Profile updated successfully!');
			setFormData((prev) => ({ ...prev, password: '' })); // Clear password field after update
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update profile.');
		} finally {
			setLoading(false);
		}
	};

	if (loading && !user) {
		return <div className="text-center mt-8 text-lg">Loading profile...</div>;
	}
	if (!user) {
		return <div className="text-center mt-8 text-lg text-red-600">Please log in to view your profile.</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h2>
				{error && <p className="text-red-500 text-center mb-4">{error}</p>}
				{success && <p className="text-green-500 text-center mb-4">{success}</p>}
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="mb-4">
							<label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
							<input
								type="text"
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
							<input
								type="text"
								id="address"
								name="address"
								value={formData.address}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						</div>
						<div className="mb-4 col-span-full">
							<label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">New Password (leave blank to keep current)</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								placeholder="Enter new password"
							/>
						</div>
					</div>
					<div className="flex justify-center mt-6">
						<button
							type="submit"
							className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
							disabled={loading}
						>
							{loading ? 'Updating...' : 'Update Profile'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ProfilePage;