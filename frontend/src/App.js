// client/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import OrderHistoryPage from './pages/OrderHistoryPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // We'll create this

function App() {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<main className="py-4">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						

						{/* Protected Routes */}
						<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
						<Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
						<Route path="/restaurants/:id" element={<ProtectedRoute><RestaurantDetailPage /></ProtectedRoute>} />
						<Route path="/my-orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

						{/* Role-specific Protected Routes */}
						<Route
							path="/owner/dashboard"
							element={<ProtectedRoute roles={['restaurant_owner']}><RestaurantOwnerDashboard /></ProtectedRoute>}
						/>
						<Route
							path="/delivery/dashboard"
							element={<ProtectedRoute roles={['delivery_personnel']}><DeliveryDashboard /></ProtectedRoute>}
						/>

						{/* Fallback for unknown routes */}
						<Route path="*" element={<h1 className="text-center text-3xl mt-10">404 - Page Not Found</h1>} />
					</Routes>
				</main>
			</Router>
		</AuthProvider>
	);
}

export default App;