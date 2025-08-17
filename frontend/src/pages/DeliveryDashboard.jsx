// client/src/pages/DeliveryDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';

const DeliveryDashboard = () => {
	const { user } = useAuth();
	const [deliveryOrders, setDeliveryOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
 
	console.log("test");
	const fetchDeliveryOrders = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await axiosInstance.get('/api/orders/delivery-queue', {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setDeliveryOrders(res.data);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch delivery orders.');
		} finally {
			setLoading(false);
		}
	},[user.token]);

	const handleUpdateOrderStatus = async (orderId, newStatus) => {
		if (!window.confirm(`Are you sure you want to change order status to "${newStatus.replace(/_/g, ' ')}"?`)) return;
		setLoading(true);
		setError('');
		try {
			await axiosInstance.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			fetchDeliveryOrders(); // Refresh orders
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update order status.');
		} finally {
			setLoading(false);
		}
	};
	
	useEffect(() => {
		if (user && user.role === 'delivery_personnel') {
			fetchDeliveryOrders();
		} else {
			setError('Access Denied: You must be a delivery personnel to view this page.');
			setLoading(false);
		}
	}, [user, fetchDeliveryOrders]);	

	if (loading) {
		return <div className="text-center mt-8 text-lg">Loading delivery dashboard...</div>;
	}

	if (error) {
		return <div className="text-center mt-8 text-lg text-red-600">{error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Delivery Dashboard</h2>

			{deliveryOrders.length === 0 ? (
				<p className="text-center text-gray-600 text-xl">No orders currently available for delivery or assigned to you.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{deliveryOrders.map((order) => (
						<OrderCard
							key={order._id}
							order={order}
							userRole={user.role}
							onUpdateStatus={handleUpdateOrderStatus}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default DeliveryDashboard;