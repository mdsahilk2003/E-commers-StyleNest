import { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch admin orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            const { data: updatedOrder } = await api.put(`/orders/${orderId}/status`, { status: newStatus });

            // Optimistically update order in state
            setOrders((prev) =>
                prev.map((ord) => (ord._id === orderId ? updatedOrder : ord))
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = statusFilter === 'ALL'
        ? orders
        : orders.filter((o) => o.status === statusFilter);

    const statuses = [
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Out For Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container-custom max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-500">Admin Order Management</h1>
                        <p className="text-sm text-gray-600">View, manage, and update customer order statuses</p>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
                        <button
                            onClick={() => setStatusFilter('ALL')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                statusFilter === 'ALL' ? 'bg-navy-500 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            All Orders ({orders.length})
                        </button>
                        {statuses.map((st) => {
                            const count = orders.filter((o) => o.status === st).length;
                            return (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                        statusFilter === st ? 'bg-navy-500 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {st} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500 mx-auto"></div>
                        <p className="mt-3 text-sm text-gray-500">Loading orders list...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 max-w-md mx-auto my-8">
                        <h3 className="text-lg font-bold text-navy-500 mb-1">No Orders Found</h3>
                        <p className="text-gray-500 text-sm">There are no orders matching filter "{statusFilter}".</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const customerName = order.user?.name || order.shippingAddress?.fullName || 'Customer';
                            const customerEmail = order.user?.email || 'N/A';
                            const customerPhone = order.user?.phone || order.shippingAddress?.phone || 'N/A';

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 hover:border-gray-300 transition-all"
                                >
                                    {/* Top Metadata Row */}
                                    <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-3 text-xs sm:text-sm">
                                        <div>
                                            <span className="text-gray-400 font-semibold block text-[10px] uppercase">Order ID</span>
                                            <span className="font-extrabold text-navy-500 text-sm">#{order._id}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 font-semibold block text-[10px] uppercase">Order Date</span>
                                            <span className="font-bold text-gray-700">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 font-semibold block text-[10px] uppercase">Grand Total</span>
                                            <span className="font-extrabold text-gold-600 text-base">₹{order.totalPrice.toFixed(2)}</span>
                                        </div>

                                        {/* Status Update Dropdown */}
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-bold text-navy-500">Order Status:</label>
                                            <select
                                                value={order.status}
                                                disabled={updatingId === order._id}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="bg-navy-50 border border-navy-200 text-navy-500 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold-500 outline-none"
                                            >
                                                {statuses.map((st) => (
                                                    <option key={st} value={st}>
                                                        {st}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Customer & Shipping Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-xs">
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                                            <h4 className="font-bold text-navy-500 text-sm mb-2 uppercase tracking-wider">
                                                Customer Info
                                            </h4>
                                            <p><span className="font-semibold text-gray-700">Name:</span> {customerName}</p>
                                            <p><span className="font-semibold text-gray-700">Email:</span> {customerEmail}</p>
                                            <p><span className="font-semibold text-gray-700">Phone:</span> {customerPhone}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                                            <h4 className="font-bold text-navy-500 text-sm mb-2 uppercase tracking-wider">
                                                Shipping Address
                                            </h4>
                                            {order.shippingAddress ? (
                                                <>
                                                    <p className="font-bold text-gray-800">
                                                        {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {order.shippingAddress.houseNo}, {order.shippingAddress.street}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-400">Address info unavailable</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ordered Products */}
                                    <div className="mb-4">
                                        <h4 className="font-bold text-navy-500 text-xs uppercase tracking-wider mb-3">
                                            Ordered Items ({order.orderItems.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                                    />
                                                    <div className="flex-grow min-w-0">
                                                        <h5 className="font-bold text-navy-500 truncate">{item.name}</h5>
                                                        <p className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                    </div>
                                                    <span className="font-bold text-navy-500">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Details: Payment Method & Payment Status */}
                                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="text-gray-500">Payment Method: </span>
                                                <span className="font-bold text-navy-500">{order.paymentMethod}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-500">Payment Status: </span>
                                                <span
                                                    className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                                                        order.paymentStatus === 'PAID'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        {order.paymentMethod === 'COD' && order.paymentStatus === 'UNPAID' && order.status === 'Delivered' && (
                                            <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                                ✓ Automatically converted to PAID upon Delivery!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
