// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className="bg-gray-800 p-4 text-white shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition-colors duration-200">
					FoodieExpress
				</Link>
				<div className="flex space-x-4 items-center">
					{user ? (
						<>
							{user.role === 'customer' && (
								<>
									<Link to="/restaurants" className="hover:text-orange-300">Restaurants</Link>
									<Link to="/my-orders" className="hover:text-orange-300">My Orders</Link>
								</>
							)}
							{user.role === 'restaurant_owner' && (
								<>
									<Link to="/owner/dashboard" className="hover:text-orange-300">Restaurant Dashboard</Link>
									<Link to="/my-orders" className="hover:text-orange-300">Restaurant Orders</Link>
								</>
							)}
							{user.role === 'delivery_personnel' && (
								<>
									<Link to="/delivery/dashboard" className="hover:text-orange-300">Delivery Dashboard</Link>
								</>
							)}
							<Link to="/profile" className="hover:text-orange-300">Profile</Link>
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors duration-200"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="hover:text-orange-300">Login</Link>
							<Link to="/register" className="hover:text-orange-300">Register</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;