// client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
			<h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
				Your Cravings, Delivered.
			</h1>
			<p className="text-xl text-gray-600 mb-8 max-w-2xl">
				Discover the best restaurants near you and get your favourite meals delivered right to your doorstep. Fast, fresh, and delicious!
			</p>
			<div className="flex space-x-4">
				<Link
					to="/restaurants"
					className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
				>
					Explore Restaurants
				</Link>
				<Link
					to="/register"
					className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
				>
					Join Us
				</Link>
			</div>

			<div className="mt-16 w-full max-w-4xl">
				<h2 className="text-3xl font-bold text-gray-800 mb-8">How It Works</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<div className="bg-orange-100 p-3 rounded-full mb-4">
							<svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">1. Find Your Food</h3>
						<p className="text-gray-600">Browse through a wide selection of restaurants and cuisines.</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<div className="bg-orange-100 p-3 rounded-full mb-4">
							<svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">2. Place Your Order</h3>
						<p className="text-gray-600">Add items to your cart and checkout securely.</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<div className="bg-orange-100 p-3 rounded-full mb-4">
							<svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">3. Enjoy Your Meal</h3>
						<p className="text-gray-600">Track your order in real-time and enjoy your delicious food.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;