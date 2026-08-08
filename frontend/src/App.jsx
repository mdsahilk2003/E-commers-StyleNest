import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import NewArrivals from './pages/NewArrivals';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import ProductDetail from './pages/ProductDetail';
import OrderSuccess from './pages/OrderSuccess';
import Addresses from './pages/Addresses';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import DashboardStats from './pages/admin/DashboardStats';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ProductProvider>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-grow">
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Home />} />

                                    <Route path="/products" element={<Shop />} />
                                    <Route path="/product/:id" element={<ProductDetail />} />
                                    <Route path="/new-arrivals" element={<NewArrivals />} />
                                    <Route path="/offers" element={<Offers />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/cart" element={<Cart />} />

                                    {/* Protected Routes */}
                                    <Route
                                        path="/checkout"
                                        element={
                                            <ProtectedRoute>
                                                <Checkout />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <ProtectedRoute>
                                                <OrderHistory />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/order-success/:id"
                                        element={
                                            <ProtectedRoute>
                                                <OrderSuccess />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/addresses"
                                        element={
                                            <ProtectedRoute>
                                                <Addresses />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Admin Routes */}
                                    <Route
                                        path="/admin/dashboard"
                                        element={
                                            <AdminRoute>
                                                <AdminDashboard />
                                            </AdminRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/orders"
                                        element={
                                            <AdminRoute>
                                                <AdminOrders />
                                            </AdminRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/add-product"
                                        element={
                                            <AdminRoute>
                                                <AddProduct />
                                            </AdminRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/edit-product/:id"
                                        element={
                                            <AdminRoute>
                                                <EditProduct />
                                            </AdminRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/stats"
                                        element={
                                            <AdminRoute>
                                                <DashboardStats />
                                            </AdminRoute>
                                        }
                                    />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </ProductProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
