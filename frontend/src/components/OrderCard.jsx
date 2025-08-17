// client/src/components/OrderCard.jsx
import React from 'react';

const OrderCard = ({ order, userRole, onUpdateStatus, onAssignDelivery, onRateOrder }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'confirmed': return 'bg-blue-100 text-blue-800';
			case 'preparing': return 'bg-indigo-100 text-indigo-800';
			case 'ready_for_pickup': return 'bg-purple-100 text-purple-800';
			case 'out_for_delivery': return 'bg-teal-100 text-teal-800';
			case 'delivered': return 'bg-green-100 text-green-800';
			case 'cancelled':
			case 'rejected': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const formatAddress = (address) => {
		if (!address) return 'N/A';
		return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
			<div className="flex justify-between items-center mb-4 border-b pb-3">
				<h3 className="text-xl font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
				<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.replace(/_/g, ' ').toUpperCase()}
        </span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
				<div>
					<p><strong>Restaurant:</strong> {order.restaurant?.name || 'N/A'}</p>
					<p><strong>Customer:</strong> {order.customer?.name || 'N/A'}</p>
					<p><strong>Delivery Address:</strong> {formatAddress(order.deliveryAddress)}</p>
					<p><strong>Total:</strong> AUD {order.totalPrice.toFixed(2)}</p>
				</div>
				<div>
					<p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
					<p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
					{order.deliveryPersonnel && <p><strong>Delivery By:</strong> {order.deliveryPersonnel.name || 'Assigned'}</p>}
					{order.estimatedDeliveryTime && <p><strong>Est. Delivery:</strong> {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</p>}
				</div>
			</div>

			<div className="mb-4">
				<h4 className="font-medium text-gray-800 mb-2">Items:</h4>
				<ul className="list-disc list-inside text-gray-600">
					{order.items.map((item, index) => (
						<li key={index}>{item.name} x {item.quantity} (AUD {item.price.toFixed(2)} each)</li>
					))}
				</ul>
			</div>

			{order.orderNotes && <p className="text-sm text-gray-600 mb-2"><strong>Notes:</strong> {order.orderNotes}</p>}
			{order.deliveryInstructions && <p className="text-sm text-gray-600 mb-4"><strong>Delivery Instructions:</strong> {order.deliveryInstructions}</p>}

			{/* Action Buttons based on Role and Status (Restaurant Owner/Admin) */}
			{(userRole === 'restaurant_owner' || userRole === 'admin') && onUpdateStatus && (
				<div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
					{order.status === 'pending' && (
						<>
							<button onClick={() => onUpdateStatus(order._id, 'confirmed')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Confirm</button>
							<button onClick={() => onUpdateStatus(order._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
						</>
					)}
					{order.status === 'confirmed' && (
						<button onClick={() => onUpdateStatus(order._id, 'preparing')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Start Preparing</button>
					)}
					{order.status === 'preparing' && (
						<button onClick={() => onUpdateStatus(order._id, 'ready_for_pickup')} className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Ready for Pickup</button>
					)}
					{/* Assign delivery personnel button */}
					{(order.status === 'confirmed' || order.status === 'ready_for_pickup') && !order.deliveryPersonnel && onAssignDelivery && (
						<button onClick={() => onAssignDelivery(order)} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600">Assign Delivery</button>
					)}
				</div>
			)}

			{/* Action Buttons based on Role and Status (Delivery Personnel) */}
			{userRole === 'delivery_personnel' && onUpdateStatus && (
				<div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
					{/* Condition for "Pick Up & Deliver" button */}
					{order.status === 'ready_for_pickup' && order.deliveryPersonnel && (
						<button onClick={() => onUpdateStatus(order._id, 'out_for_delivery')} className="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600">Pick Up & Deliver</button>
					)}
					{/* Condition for "Mark as Delivered" button */}
					{order.status === 'out_for_delivery' && order.deliveryPersonnel && (
						<button onClick={() => onUpdateStatus(order._id, 'delivered')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Mark as Delivered</button>
					)}
				</div>
			)}

			{/* --- ADDED: Logic for the "Rate Order" button (Customer Role) --- */}
			{userRole === 'customer' && order.status === 'delivered' && (
				<div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
					<button
						onClick={() => onRateOrder(order)}
						className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 transition-colors duration-200"
					>
						Rate Order
					</button>
				</div>
			)}
			{/* --- END ADDED CODE --- */}

		</div>
	);
};

export default OrderCard;