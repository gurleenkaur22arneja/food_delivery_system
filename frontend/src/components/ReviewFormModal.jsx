// client/src/components/ReviewFormModal.jsx
import React, { useState, useEffect } from 'react';

const ReviewFormModal = ({ order, onClose, onSubmit, existingReview }) => {
	const [restaurantRating, setRestaurantRating] = useState(existingReview?.restaurantRating || 0);
	const [restaurantComment, setRestaurantComment] = useState(existingReview?.restaurantComment || '');
	const [deliveryRating, setDeliveryRating] = useState(existingReview?.deliveryRating || 0);
	const [deliveryComment, setDeliveryComment] = useState(existingReview?.deliveryComment || '');
	const [error, setError] = useState('');

	useEffect(() => {
		if (existingReview) {
			setRestaurantRating(existingReview.restaurantRating);
			setRestaurantComment(existingReview.restaurantComment);
			setDeliveryRating(existingReview.deliveryRating || 0);
			setDeliveryComment(existingReview.deliveryComment || '');
		} else {
			setRestaurantRating(0);
			setRestaurantComment('');
			setDeliveryRating(0);
			setDeliveryComment('');
		}
	}, [existingReview]);


	const handleSubmit = (e) => {
		e.preventDefault();
		setError('');
		if (restaurantRating === 0) {
			setError('Please provide a rating for the restaurant.');
			return;
		}
		onSubmit({
			orderId: order._id,
			restaurantRating,
			restaurantComment,
			deliveryRating: deliveryRating || undefined, // Only send if provided
			deliveryComment,
		});
	};

	const StarRating = ({ rating, setRating }) => {
		return (
			<div className="flex items-center">
				{[1, 2, 3, 4, 5].map((star) => (
					<svg
						key={star}
						className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
						fill="currentColor"
						viewBox="0 0 20 20"
						onClick={() => setRating(star)}
					>
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
					</svg>
				))}
			</div>
		);
	};

	if (!order) return null;

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Review Order from {order.restaurant?.name}</h2>
				<p className="text-gray-600 mb-4">Order ID: {order._id.slice(-6)}</p>

				{error && <p className="text-red-500 mb-4">{error}</p>}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">Restaurant Rating <span className="text-red-500">*</span></label>
						<StarRating rating={restaurantRating} setRating={setRestaurantRating} />
					</div>
					<div className="mb-4">
						<label htmlFor="restaurantComment" className="block text-gray-700 text-sm font-bold mb-2">Restaurant Comment</label>
						<textarea
							id="restaurantComment"
							value={restaurantComment}
							onChange={(e) => setRestaurantComment(e.target.value)}
							rows="3"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							placeholder="How was the food and service?"
						></textarea>
					</div>

					{order.deliveryPersonnel && (
						<>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">Delivery Rating</label>
								<StarRating rating={deliveryRating} setRating={setDeliveryRating} />
							</div>
							<div className="mb-4">
								<label htmlFor="deliveryComment" className="block text-gray-700 text-sm font-bold mb-2">Delivery Comment</label>
								<textarea
									id="deliveryComment"
									value={deliveryComment}
									onChange={(e) => setDeliveryComment(e.target.value)}
									rows="3"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									placeholder="How was the delivery experience?"
								></textarea>
							</div>
						</>
					)}

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Submit Review
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ReviewFormModal;