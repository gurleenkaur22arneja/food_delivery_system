// client/src/pages/RestaurantOwnerDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import RestaurantForm from '../components/RestaurantForm';
import MenuItemForm from '../components/MenuItemForm';
import MenuItemCard from '../components/MenuItemCard';

const RestaurantOwnerDashboard = () => {
	const { user } = useAuth();
	const [myRestaurants, setMyRestaurants] = useState([]);
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);
	const [menuItems, setMenuItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showRestaurantForm, setShowRestaurantForm] = useState(false);
	const [editingRestaurant, setEditingRestaurant] = useState(null);
	const [showMenuItemForm, setShowMenuItemForm] = useState(false);
	const [editingMenuItem, setEditingMenuItem] = useState(null);

	const fetchOwnerData = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await axiosInstance.get('/api/restaurants/my-restaurants', {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setMyRestaurants(res.data);
			if (res.data.length > 0) {
				setSelectedRestaurant(res.data[0]); // Select first restaurant by default
				fetchMenuItems(res.data[0]._id);
			} else {
				setMenuItems([]);
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch owner data.');
		} finally {
			setLoading(false);
		}
	},[user.token]);

	useEffect(() => {
		if (user && user.role === 'restaurant_owner') {
			fetchOwnerData();
		} else {
			setError('Access Denied: You must be a restaurant owner to view this page.');
			setLoading(false);
		}
	}, [user, fetchOwnerData]);	

	const fetchMenuItems = async (restaurantId) => {
		try {
			const res = await axiosInstance.get(`/api/menu-items/restaurants/${restaurantId}/menu`);
			setMenuItems(res.data);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch menu items.');
		}
	};

	const handleRestaurantSelect = (restaurant) => {
		setSelectedRestaurant(restaurant);
		fetchMenuItems(restaurant._id);
		setShowRestaurantForm(false);
		setEditingRestaurant(null);
		setShowMenuItemForm(false);
		setEditingMenuItem(null);
	};

	// Restaurant CRUD
	const handleAddRestaurant = () => {
		setEditingRestaurant(null);
		setShowRestaurantForm(true);
	};

	const handleEditRestaurant = (restaurant) => {
		setEditingRestaurant(restaurant);
		setShowRestaurantForm(true);
	};

	const handleRestaurantSubmit = async (data) => {
		setLoading(true);
		setError('');
		try {
			if (editingRestaurant) {
				await axiosInstance.put(`/api/restaurants/${editingRestaurant._id}`, data, {
					headers: { Authorization: `Bearer ${user.token}` },
				});
			} else {
				await axiosInstance.post('/api/restaurants', data, {
					headers: { Authorization: `Bearer ${user.token}` },
				});
			}
			setShowRestaurantForm(false);
			setEditingRestaurant(null);
			fetchOwnerData(); // Refresh list
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to save restaurant.');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRestaurant = async (restaurantId) => {
		if (!window.confirm('Are you sure you want to delete this restaurant and all its menu items?')) return;
		setLoading(true);
		setError('');
		try {
			await axiosInstance.delete(`/api/restaurants/${restaurantId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			fetchOwnerData();
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to delete restaurant.');
		} finally {
			setLoading(false);
		}
	};

	// Menu Item CRUD
	const handleAddMenuItem = () => {
		setEditingMenuItem(null);
		setShowMenuItemForm(true);
	};

	const handleEditMenuItem = (item) => {
		setEditingMenuItem(item);
		setShowMenuItemForm(true);
	};

	const handleMenuItemSubmit = async (data) => {
		if (!selectedRestaurant) {
			setError('Please select a restaurant first.');
			return;
		}
		setLoading(true);
		setError('');
		try {
			if (editingMenuItem) {
				await axiosInstance.put(`/api/menu-items/${editingMenuItem._id}`, data, {
					headers: { Authorization: `Bearer ${user.token}` },
				});
			} else {
				await axiosInstance.post(`/api/menu-items/restaurants/${selectedRestaurant._id}/menu`, data, {
					headers: { Authorization: `Bearer ${user.token}` },
				});
			}
			setShowMenuItemForm(false);
			setEditingMenuItem(null);
			fetchMenuItems(selectedRestaurant._id); // Refresh menu items
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to save menu item.');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteMenuItem = async (itemId) => {
		if (!window.confirm('Are you sure you want to delete this menu item?')) return;
		setLoading(true);
		setError('');
		try {
			await axiosInstance.delete(`/api/menu-items/${itemId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			fetchMenuItems(selectedRestaurant._id);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to delete menu item.');
		} finally {
			setLoading(false);
		}
	};


	if (loading) {
		return <div className="text-center mt-8 text-lg">Loading dashboard...</div>;
	}

	if (error) {
		return <div className="text-center mt-8 text-lg text-red-600">{error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Restaurant Owner Dashboard</h2>

			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-gray-700">Your Restaurants</h3>
				<button
					onClick={handleAddRestaurant}
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
				>
					Add New Restaurant
				</button>
			</div>

			{myRestaurants.length === 0 && !showRestaurantForm ? (
				<p className="text-center text-gray-600 text-lg mb-6">You don't own any restaurants yet. Click "Add New Restaurant" to get started!</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					{myRestaurants.map((restaurant) => (
						<div
							key={restaurant._id}
							className={`bg-white p-4 rounded-lg shadow-md cursor-pointer border-2 ${selectedRestaurant?._id === restaurant._id ? 'border-orange-500' : 'border-transparent'} hover:border-orange-400 transition-all duration-200`}
							onClick={() => handleRestaurantSelect(restaurant)}
						>
							<h4 className="text-xl font-semibold text-gray-800">{restaurant.name}</h4>
							<p className="text-gray-600 text-sm">{restaurant.cuisineType.join(', ')}</p>
							<p className={`text-sm mt-2 ${restaurant.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
								Status: {restaurant.isApproved ? 'Approved' : 'Pending Approval'}
							</p>
							<div className="mt-3 flex space-x-2">
								<button onClick={(e) => { e.stopPropagation(); handleEditRestaurant(restaurant); }} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
								<button onClick={(e) => { e.stopPropagation(); handleDeleteRestaurant(restaurant._id); }} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
							</div>
						</div>
					))}
				</div>
			)}

			{showRestaurantForm && (
				<div className="mb-8">
					<RestaurantForm
						onSubmit={handleRestaurantSubmit}
						initialData={editingRestaurant}
						isEditing={!!editingRestaurant}
						loading={loading}
					/>
					<button onClick={() => setShowRestaurantForm(false)} className="mt-4 text-gray-600 hover:text-gray-800">Cancel</button>
				</div>
			)}

			{selectedRestaurant && !showRestaurantForm && (
				<div className="mt-10">
					<h3 className="text-3xl font-bold text-gray-800 mb-6">Menu for {selectedRestaurant.name}</h3>
					<div className="flex justify-end mb-4">
						<button
							onClick={handleAddMenuItem}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
						>
							Add New Menu Item
						</button>
					</div>

					{showMenuItemForm && (
						<div className="mb-8">
							<MenuItemForm
								onSubmit={handleMenuItemSubmit}
								initialData={editingMenuItem}
								isEditing={!!editingMenuItem}
								loading={loading}
							/>
							<button onClick={() => setShowMenuItemForm(false)} className="mt-4 text-gray-600 hover:text-gray-800">Cancel</button>
						</div>
					)}

					{menuItems.length === 0 && !showMenuItemForm ? (
						<p className="text-center text-gray-600 text-lg">No menu items for this restaurant yet. Add one!</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{menuItems.map((item) => (
								<MenuItemCard
									key={item._id}
									item={item}
									showControls={true}
									onEdit={handleEditMenuItem}
									onDelete={handleDeleteMenuItem}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default RestaurantOwnerDashboard;