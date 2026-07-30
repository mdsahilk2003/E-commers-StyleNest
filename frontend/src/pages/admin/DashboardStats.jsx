import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Loading from '../../components/Loading';

const DashboardStats = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom">
                <div className="mb-8">
                    <button onClick={() => navigate('/admin/dashboard')} className="text-navy-500 hover:text-gold-500 mb-4">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-2">Detailed Statistics</h1>
                    <p className="text-gray-600">Complete overview of your store performance</p>
                </div>

                {/* Detailed Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium mb-2 opacity-90">Total Revenue</h3>
                        <p className="text-4xl font-bold">₹{stats?.totalRevenue || '0.00'}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium mb-2 opacity-90">Total Orders</h3>
                        <p className="text-4xl font-bold">{stats?.totalOrders || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium mb-2 opacity-90">Total Users</h3>
                        <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium mb-2 opacity-90">Total Products</h3>
                        <p className="text-4xl font-bold">{stats?.totalProducts || 0}</p>
                    </div>
                </div>

                {/* Orders by Status */}
                {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-navy-500 mb-6">Orders by Status</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.ordersByStatus.map((item) => (
                                <div key={item._id} className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 text-sm mb-1 capitalize">{item._id || 'Unknown'}</p>
                                    <p className="text-3xl font-bold text-navy-500">{item.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Orders Table */}
                {stats?.recentOrders && stats.recentOrders.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-navy-500 mb-6">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Order ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Customer</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Total</th>
                                        <th className="text-left py-3 px-4 font-semibold text-navy-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order) => (
                                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-mono">#{order._id.slice(-8)}</td>
                                            <td className="py-3 px-4 text-sm">{order.user?.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm">{order.user?.email || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-green-600">₹{order.totalPrice.toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Low Stock Products */}
                {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-navy-500 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Low Stock Alert
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.lowStockProducts.map((product) => (
                                <div key={product._id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="font-medium text-navy-500">{product.name}</span>
                                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                                        {product.stock} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardStats;
