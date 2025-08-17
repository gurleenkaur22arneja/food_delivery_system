// client/src/components/AssignDeliveryModal.jsx
import React, { useState, useEffect } from 'react';

const AssignDeliveryModal = ({ order, deliveryPersonnelList, onClose, onAssign }) => {
	const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (deliveryPersonnelList && deliveryPersonnelList.length > 0) {
			setSelectedPersonnelId(deliveryPersonnelList[0]._id); // Pre-select first one
		}
	}, [deliveryPersonnelList]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError('');
		if (!selectedPersonnelId) {
			setError('Please select a delivery personnel.');
			return;
		}
		onAssign(order._id, selectedPersonnelId);
	};

	// --- IMPORTANT CHANGE HERE ---
	// Add a check for 'order' and 'order._id' before rendering anything that uses them
	if (!order || !order._id) {
		// Optionally, you could call onClose() here or render a simple message
		// For now, just return null to prevent the error
		return null;
	}
	// --- END IMPORTANT CHANGE ---

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
				{/* Now we are sure order and order._id exist */}
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Assign Delivery for Order #{order._id.slice(-6)}</h2>
				<p className="text-gray-600 mb-4">Restaurant: {order.restaurant?.name}</p>
				<p className="text-gray-600 mb-4">Customer: {order.customer?.name}</p>

				{error && <p className="text-red-500 mb-4">{error}</p>}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="deliveryPersonnel" className="block text-gray-700 text-sm font-bold mb-2">Select Delivery Personnel</label>
						<select
							id="deliveryPersonnel"
							value={selectedPersonnelId}
							onChange={(e) => setSelectedPersonnelId(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							required
						>
							{deliveryPersonnelList.length === 0 ? (
								<option value="">No delivery personnel available</option>
							) : (
								deliveryPersonnelList.map((personnel) => (
									<option key={personnel._id} value={personnel._id}>
										{personnel.name} ({personnel.email})
									</option>
								))
							)}
						</select>
					</div>

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
							disabled={!selectedPersonnelId || deliveryPersonnelList.length === 0}
							className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Assign
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AssignDeliveryModal;