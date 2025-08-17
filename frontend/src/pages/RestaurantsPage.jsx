// client/src/pages/RestaurantsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				const response = await axiosInstance.get('/api/restaurants');
				setRestaurants(response.data);
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to fetch restaurants.');
			} finally {
				setLoading(false);
			}
		};

		fetchRestaurants();
	}, []);

	if (loading) {
		return <div className="text-center mt-8 text-lg">Loading restaurants...</div>;
	}

	if (error) {
		return <div className="text-center mt-8 text-lg text-red-600">{error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Restaurants</h2>
			{restaurants.length === 0 ? (
				<p className="text-center text-gray-600 text-xl">No restaurants available at the moment. Please check back later!</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{restaurants.map((restaurant) => (
						<RestaurantCard key={restaurant._id} restaurant={restaurant} />
					))}
				</div>
			)}
		</div>
	);
};

export default RestaurantsPage;