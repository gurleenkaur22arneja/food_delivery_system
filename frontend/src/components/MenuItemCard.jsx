// client/src/components/MenuItemCard.jsx
import React from 'react';

const MenuItemCard = ({ item, onAddToCart, showControls = false, onEdit, onDelete }) => {
	return (
		<div className="flex items-center bg-white rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-shadow duration-200">
			<img
				src={item.imageUrl || 'https://via.placeholder.com/80x80?text=Food'}
				alt={item.name}
				className="w-20 h-20 object-cover rounded-md mr-4"
			/>
			<div className="flex-grow">
				<h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
				<p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
				<p className="text-orange-600 font-bold mt-1">AUD {item.price.toFixed(2)}</p>
				{!item.isAvailable && (
					<span className="text-red-500 text-xs font-medium">Currently Unavailable</span>
				)}
			</div>
			<div className="flex flex-col items-end space-y-2">
				{onAddToCart && item.isAvailable && (
					<button
						onClick={() => onAddToCart(item)}
						className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors duration-200"
					>
						Add to Cart
					</button>
				)}
				{showControls && (
					<div className="flex space-x-2">
						<button
							onClick={() => onEdit(item)}
							className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-200"
						>
							Edit
						</button>
						<button
							onClick={() => onDelete(item._id)}
							className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MenuItemCard;