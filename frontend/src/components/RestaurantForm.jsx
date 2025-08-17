// client/src/components/RestaurantForm.jsx
import React, { useState, useEffect } from 'react';

const RestaurantForm = ({ onSubmit, initialData = {}, isEditing = false, loading = false }) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		address: { street: '', city: '', state: '', zipCode: '' },
		cuisineType: '', // Comma-separated string
		contactPhone: '',
		contactEmail: '',
		imageUrl: '',
	});

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setFormData({
				name: initialData.name || '',
				description: initialData.description || '',
				address: {
					street: initialData.address?.street || '',
					city: initialData.address?.city || '',
					state: initialData.address?.state || '',
					zipCode: initialData.address?.zipCode || '',
				},
				cuisineType: initialData.cuisineType ? initialData.cuisineType.join(', ') : '',
				contactPhone: initialData.contactPhone || '',
				contactEmail: initialData.contactEmail || '',
				imageUrl: initialData.imageUrl || '',
			});
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name.startsWith('address.')) {
			const addressField = name.split('.')[1];
			setFormData((prev) => ({
				...prev,
				address: { ...prev.address, [addressField]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const dataToSend = {
			...formData,
			cuisineType: formData.cuisineType.split(',').map(type => type.trim()).filter(type => type),
		};
		onSubmit(dataToSend);
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-2xl font-semibold text-gray-800 mb-6">{isEditing ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="mb-4">
					<label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Restaurant Name</label>
					<input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="cuisineType" className="block text-gray-700 text-sm font-bold mb-2">Cuisine Types (comma-separated)</label>
					<input type="text" id="cuisineType" name="cuisineType" value={formData.cuisineType} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
				<textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3"
				          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
			</div>

			<h4 className="text-lg font-medium text-gray-700 mb-3 mt-4">Address Details</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="mb-4">
					<label htmlFor="address.street" className="block text-gray-700 text-sm font-bold mb-2">Street</label>
					<input type="text" id="address.street" name="address.street" value={formData.address.street} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="address.city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
					<input type="text" id="address.city" name="address.city" value={formData.address.city} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="address.state" className="block text-gray-700 text-sm font-bold mb-2">State</label>
					<input type="text" id="address.state" name="address.state" value={formData.address.state} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="address.zipCode" className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
					<input type="text" id="address.zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
			</div>

			<h4 className="text-lg font-medium text-gray-700 mb-3 mt-4">Contact Information</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="mb-4">
					<label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
					<input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="contactEmail" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
					<input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
			</div>

			<div className="mb-6">
				<label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
				<input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
				       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
			</div>

			<div className="flex justify-center">
				<button type="submit" disabled={loading}
				        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
					{loading ? 'Saving...' : (isEditing ? 'Update Restaurant' : 'Add Restaurant')}
				</button>
			</div>
		</form>
	);
};

export default RestaurantForm;