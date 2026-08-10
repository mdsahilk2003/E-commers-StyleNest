import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchProducts()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                // Refresh list and stats
                await Promise.all([fetchProducts(), fetchStats()]);
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600">Welcome back! Here's your store overview.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-medium">Total Revenue</h3>
                            <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-navy-500">₹{stats?.totalRevenue || '0.00'}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-medium">Total Orders</h3>
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-navy-500">{stats?.totalOrders || 0}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-medium">Total Users</h3>
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-navy-500">{stats?.totalUsers || 0}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-medium">Total Products</h3>
                            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-navy-500">{stats?.totalProducts || 0}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-navy-500 mb-6">Admin Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dashboard Stats Button */}
                        <Link to="/admin/stats" className="group">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center justify-between mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
                                <p className="text-blue-100">View detailed statistics and analytics</p>
                            </div>
                        </Link>

                        {/* Add Item Button */}
                        <Link to="/admin/add-product" className="group">
                            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center justify-between mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Add Item</h3>
                                <p className="text-green-100">Add new products to your store</p>
                            </div>
                        </Link>
                    </div>
                </div>


                              {/* Manage Products */}
                {products && products.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-navy-500">
                                Manage Products ({products.length})
                            </h2>
                            <div className="w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-field py-2"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Image</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Stock</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products
                                        .filter(
                                            (product) =>
                                                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                product.category.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((product) => (
                                            <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="w-12 h-12 rounded overflow-hidden">
                                                        <img 
                                                            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-navy-500">{product.name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                                                <td className="py-3 px-4 text-sm text-navy-500 font-semibold">₹{product.price}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {product.stock} left
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <Link 
                                                            to={`/admin/edit-product/${product._id}`} 
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-semibold transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(product._id)} 
                                                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
