// client/src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';
import ReviewFormModal from '../components/ReviewFormModal';
import AssignDeliveryModal from '../components/AssignDeliveryModal'; // <--- Import the new modal

const OrderHistoryPage = () => {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [selectedOrderToReview, setSelectedOrderToReview] = useState(null);
	const [reviewSubmissionError, setReviewSubmissionError] = useState('');
	const [reviewSubmissionSuccess, setReviewSubmissionSuccess] = useState('');

	// New states for delivery assignment
	const [showAssignDeliveryModal, setShowAssignDeliveryModal] = useState(false);
	const [selectedOrderToAssign, setSelectedOrderToAssign] = useState(null);
	const [deliveryPersonnelList, setDeliveryPersonnelList] = useState([]);
	const [assignError, setAssignError] = useState('');
	const [assignSuccess, setAssignSuccess] = useState('');


	useEffect(() => {
		if (user) {
			fetchOrders();
			// Fetch delivery personnel list if the user is an owner or admin
			if (user.role === 'restaurant_owner' || user.role === 'admin') {
				fetchDeliveryPersonnel();
			}
		} else {
			setError('Please log in to view your orders.');
			setLoading(false);
		}
	}, [user]);

	const fetchOrders = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await axiosInstance.get('/api/orders/my-orders', {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setOrders(res.data);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch orders.');
		} finally {
			setLoading(false);
		}
	};

	const fetchDeliveryPersonnel = async () => {
		try {
			const res = await axiosInstance.get('/api/auth/delivery-personnel', {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setDeliveryPersonnelList(res.data);
		} catch (err) {
			console.error('Failed to fetch delivery personnel:', err);
			// Optionally set an error state here
		}
	};

	const handleUpdateOrderStatus = async (orderId, newStatus) => {
		if (!window.confirm(`Are you sure you want to change order status to "${newStatus.replace(/_/g, ' ')}"?`)) return;
		setLoading(true);
		setError('');
		try {
			await axiosInstance.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			fetchOrders(); // Refresh orders
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update order status.');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelOrder = async (orderId) => {
		if (!window.confirm('Are you sure you want to cancel this order?')) return;
		setLoading(true);
		setError('');
		try {
			await axiosInstance.put(`/api/orders/${orderId}/cancel`, {}, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			fetchOrders(); // Refresh orders
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to cancel order.');
		} finally {
			setLoading(false);
		}
	};

	const handleRateOrder = (order) => {
		setSelectedOrderToReview(order);
		setShowReviewModal(true);
		setReviewSubmissionError('');
		setReviewSubmissionSuccess('');
	};

	const handleReviewSubmit = async (reviewData) => {
		setReviewSubmissionError('');
		setReviewSubmissionSuccess('');
		try {
			await axiosInstance.post('/api/reviews', reviewData, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setReviewSubmissionSuccess('Review submitted successfully!');
			setShowReviewModal(false);
			setSelectedOrderToReview(null);
			fetchOrders(); // Refresh orders to potentially show review status
		} catch (err) {
			setReviewSubmissionError(err.response?.data?.message || 'Failed to submit review.');
		}
	};

	// New function to open the assignment modal
	const handleAssignDeliveryClick = (order) => {
		setSelectedOrderToAssign(order);
		setShowAssignDeliveryModal(true);
		setAssignError('');
		setAssignSuccess('');
	};

	// New function to handle the actual assignment API call from the modal
	const handleAssignDeliverySubmit = async (orderId, deliveryPersonnelId) => {
		setAssignError('');
		setAssignSuccess('');
		try {
			await axiosInstance.put(`/api/orders/${orderId}/assign-delivery`, { deliveryPersonnelId }, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setAssignSuccess(`Order ${orderId.slice(-6)} successfully assigned.`);
			setShowAssignDeliveryModal(false);
			setSelectedOrderToAssign(null);
			fetchOrders(); // Refresh orders
		} catch (err) {
			setAssignError(err.response?.data?.message || 'Failed to assign delivery personnel.');
		}
	};


	if (loading) {
		return <div className="text-center mt-8 text-lg">Loading your orders...</div>;
	}

	if (error) {
		return <div className="text-center mt-8 text-lg text-red-600">{error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Orders</h2>

			{orders.length === 0 ? (
				<p className="text-center text-gray-600 text-xl">You haven't placed any orders yet.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{orders.map((order) => (
						<OrderCard
							key={order._id}
							order={order}
							userRole={user.role}
							onUpdateStatus={handleUpdateOrderStatus}
							onAssignDelivery={handleAssignDeliveryClick} // <--- Use the new click handler
							onRateOrder={handleRateOrder}
						>
							{user.role === 'customer' && (order.status === 'pending' || order.status === 'confirmed') && (
								<button
									onClick={() => handleCancelOrder(order._id)}
									className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 mt-2"
								>
									Cancel Order
								</button>
							)}
						</OrderCard>
					))}
				</div>
			)}

			{showReviewModal && (
				<ReviewFormModal
					order={selectedOrderToReview}
					onClose={() => setShowReviewModal(false)}
					onSubmit={handleReviewSubmit}
				/>
			)}

			{showAssignDeliveryModal && (
				<AssignDeliveryModal
					order={selectedOrderToAssign}
					deliveryPersonnelList={deliveryPersonnelList}
					onClose={() => setShowAssignDeliveryModal(false)}
					onAssign={handleAssignDeliverySubmit} // <--- Pass the submit handler
				/>
			)}

			{reviewSubmissionError && <p className="text-red-500 text-center mt-4">{reviewSubmissionError}</p>}
			{reviewSubmissionSuccess && <p className="text-green-500 text-center mt-4">{reviewSubmissionSuccess}</p>}
			{assignError && <p className="text-red-500 text-center mt-4">{assignError}</p>}
			{assignSuccess && <p className="text-green-500 text-center mt-4">{assignSuccess}</p>}
		</div>
	);
};

export default OrderHistoryPage;