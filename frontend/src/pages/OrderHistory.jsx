import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Processing: 'bg-blue-100 text-blue-800',
            Shipped: 'bg-purple-100 text-purple-800',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container-custom">
                    <EmptyState
                        message="No orders yet"
                        icon="📦"
                        action={{ label: 'Start Shopping', onClick: () => window.location.href = '/products' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom">
                <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-8">
                    Order History
                </h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600">Order ID</p>
                                    <p className="font-semibold text-navy-500">{order._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <p className="font-semibold text-navy-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="font-semibold text-navy-500">
                                        ₹{order.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-navy-500">{item.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                                {item.size && ` • Size: ${item.size}`}
                                                {item.color && ` • Color: ${item.color}`}
                                            </p>
                                            <p className="font-semibold text-navy-500">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Address */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-semibold text-navy-500 mb-2">
                                    Shipping Address
                                </p>
                                <p className="text-sm text-gray-600">
                                    {order.shippingAddress.name}<br />
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                    {order.shippingAddress.country}<br />
                                    Phone: {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
