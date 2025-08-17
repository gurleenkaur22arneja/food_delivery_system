// client/src/components/MenuItemForm.jsx
import React, { useState, useEffect } from 'react';

const MenuItemForm = ({ onSubmit, initialData = {}, isEditing = false, loading = false }) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		category: '',
		imageUrl: '',
		isAvailable: true,
	});

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setFormData({
				name: initialData.name || '',
				description: initialData.description || '',
				price: initialData.price !== undefined ? initialData.price.toString() : '',
				category: initialData.category || '',
				imageUrl: initialData.imageUrl || '',
				isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
			});
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const dataToSend = {
			...formData,
			price: parseFloat(formData.price), // Convert price to number
		};
		onSubmit(dataToSend);
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-2xl font-semibold text-gray-800 mb-6">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="mb-4">
					<label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Item Name</label>
					<input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
					<input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
				<textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3"
				          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="mb-4">
					<label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price (AUD)</label>
					<input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0"
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
				<div className="mb-4">
					<label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
					<input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
					       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				</div>
			</div>

			<div className="mb-6 flex items-center">
				<input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange}
				       className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
				<label htmlFor="isAvailable" className="text-gray-700 text-sm font-bold">Available for Order</label>
			</div>

			<div className="flex justify-center">
				<button type="submit" disabled={loading}
				        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
					{loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Add Item')}
				</button>
			</div>
		</form>
	);
};

export default MenuItemForm;