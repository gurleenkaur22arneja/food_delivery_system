// client/src/components/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
			<img
				src={restaurant.imageUrl || 'https://via.placeholder.com/300x200?text=Restaurant'}
				alt={restaurant.name}
				className="w-full h-48 object-cover"
			/>
			<div className="p-4">
				<h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
				<p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
				<div className="flex items-center justify-between text-sm text-gray-700 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
	          {restaurant.averageRating ? `${restaurant.averageRating} (${restaurant.reviewCount})` : 'No ratings yet'}
          </span>
					<span className="text-gray-500">{restaurant.cuisineType.join(', ')}</span>
				</div>
				<Link
					to={`/restaurants/${restaurant._id}`}
					className="block w-full text-center bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
				>
					View Menu
				</Link>
			</div>
		</div>
	);
};

export default RestaurantCard;