// client/src/pages/RestaurantDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import MenuItemCard from '../components/MenuItemCard';
import { useAuth } from '../context/AuthContext';

const RestaurantDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [restaurant, setRestaurant] = useState(null);
	const [menuItems, setMenuItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [cart, setCart] = useState([]);
	const [orderLoading, setOrderLoading] = useState(false);
	const [orderError, setOrderError] = useState('');
	const [orderSuccess, setOrderSuccess] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const restaurantRes = await axiosInstance.get(`/api/restaurants/${id}`);
				setRestaurant(restaurantRes.data);

				const menuRes = await axiosInstance.get(`/api/menu-items/restaurants/${id}/menu`);
				setMenuItems(menuRes.data);
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to fetch restaurant details.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const handleAddToCart = (item) => {
		const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);
		if (existingItemIndex > -1) {
			const updatedCart = [...cart];
			updatedCart[existingItemIndex].quantity += 1;
			setCart(updatedCart);
		} else {
			setCart([...cart, { ...item, quantity: 1 }]);
		}
	};

	const handleUpdateCartQuantity = (itemId, delta) => {
		const updatedCart = cart.map((item) =>
			item._id === itemId ? { ...item, quantity: item.quantity + delta } : item
		).filter(item => item.quantity > 0);
		setCart(updatedCart);
	};

	const calculateCartTotal = () => {
		return cart.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	const handlePlaceOrder = async () => {
		if (!user) {
			alert('Please log in to place an order.');
			navigate('/login');
			return;
		}
		if (user.role !== 'customer') {
			alert('Only customers can place orders.');
			return;
		}
		if (cart.length === 0) {
			alert('Your cart is empty!');
			return;
		}

		setOrderLoading(true);
		setOrderError('');
		setOrderSuccess('');

		try {
			// For simplicity, using a dummy address and payment method.
			// In a real app, this would come from a checkout form.
			const orderData = {
				restaurantId: restaurant._id,
				items: cart.map(item => ({ menuItemId: item._id, quantity: item.quantity })),
				deliveryAddress: {
					street: user.address || '123 Main St',
					city: 'Sydney',
					state: 'NSW',
					zipCode: '2000',
					country: 'Australia',
				},
				paymentMethod: 'card', // or 'cash_on_delivery'
				orderNotes: 'Please deliver with care.',
				deliveryInstructions: 'Leave at front door.',
			};

			await axiosInstance.post('/api/orders', orderData, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setOrderSuccess('Order placed successfully! Redirecting to your orders...');
			setCart([]); // Clear cart
			setTimeout(() => navigate('/my-orders'), 2000);
		} catch (err) {
			setOrderError(err.response?.data?.message || 'Failed to place order.');
		} finally {
			setOrderLoading(false);
		}
	};


	if (loading) {
		return <div className="text-center mt-8 text-lg">Loading restaurant details...</div>;
	}

	if (error) {
		return <div className="text-center mt-8 text-lg text-red-600">{error}</div>;
	}

	if (!restaurant) {
		return <div className="text-center mt-8 text-lg">Restaurant not found.</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<img
					src={restaurant.imageUrl || 'https://via.placeholder.com/800x300?text=Restaurant+Banner'}
					alt={restaurant.name}
					className="w-full h-64 object-cover rounded-md mb-4"
				/>
				<h2 className="text-4xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
				<p className="text-gray-700 text-lg mb-3">{restaurant.description}</p>
				<div className="flex items-center text-gray-600 mb-2">
					<span className="mr-4">Cuisine: {restaurant.cuisineType.join(', ')}</span>
					<span>Address: {restaurant.address.street}, {restaurant.address.city}</span>
				</div>
				<div className="flex items-center text-sm text-gray-600">
					<svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
					{restaurant.averageRating ? `${restaurant.averageRating} (${restaurant.reviewCount} reviews)` : 'No ratings yet'}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<h3 className="text-3xl font-bold text-gray-800 mb-5">Menu</h3>
					{menuItems.length === 0 ? (
						<p className="text-gray-600 text-lg">No menu items available yet.</p>
					) : (
						<div className="space-y-4">
							{menuItems.map((item) => (
								<MenuItemCard key={item._id} item={item} onAddToCart={handleAddToCart} />
							))}
						</div>
					)}
				</div>

				<div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 sticky top-4">
					<h3 className="text-3xl font-bold text-gray-800 mb-5">Your Cart</h3>
					{cart.length === 0 ? (
						<p className="text-gray-600">Your cart is empty.</p>
					) : (
						<>
							<div className="space-y-3 mb-4">
								{cart.map((item) => (
									<div key={item._id} className="flex justify-between items-center border-b pb-2">
										<div>
											<p className="font-medium text-gray-800">{item.name}</p>
											<p className="text-sm text-gray-600">AUD {item.price.toFixed(2)} each</p>
										</div>
										<div className="flex items-center">
											<button
												onClick={() => handleUpdateCartQuantity(item._id, -1)}
												className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-300"
											>
												-
											</button>
											<span className="bg-gray-100 text-gray-800 px-3 py-1">{item.quantity}</span>
											<button
												onClick={() => handleUpdateCartQuantity(item._id, 1)}
												className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-300"
											>
												+
											</button>
										</div>
									</div>
								))}
							</div>
							<div className="flex justify-between items-center border-t pt-4 mt-4">
								<span className="text-xl font-bold text-gray-800">Total:</span>
								<span className="text-xl font-bold text-orange-600">AUD {calculateCartTotal().toFixed(2)}</span>
							</div>
							{orderError && <p className="text-red-500 text-sm mt-3">{orderError}</p>}
							{orderSuccess && <p className="text-green-500 text-sm mt-3">{orderSuccess}</p>}
							<button
								onClick={handlePlaceOrder}
								disabled={orderLoading || cart.length === 0}
								className="mt-6 w-full bg-orange-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{orderLoading ? 'Placing Order...' : 'Place Order'}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RestaurantDetailPage;