import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container-custom max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-green-100 animate-bounce">
                        ✓
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-500 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                        Thank you for your purchase with StyleNest. We've received your order and are processing it right away.
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-200 text-left text-xs sm:text-sm">
                        <div className="flex flex-wrap justify-between items-center pb-3 border-b border-gray-200 gap-2 mb-3">
                            <div>
                                <span className="text-gray-500 block text-xs">Order ID</span>
                                <span className="font-bold text-navy-500 text-sm">#{order?._id || id}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-xs">Payment Method</span>
                                <span className="font-bold text-navy-500 text-sm">{order?.paymentMethod || 'COD'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-xs">Payment Status</span>
                                <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                                    order?.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order?.paymentStatus || 'UNPAID'}
                                </span>
                            </div>
                        </div>

                        {order?.shippingAddress && (
                            <div>
                                <span className="text-gray-500 block text-xs mb-1 font-semibold">Delivery Address</span>
                                <p className="font-medium text-gray-800">
                                    {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                                </p>
                                <p className="text-gray-600 text-xs">
                                    {order.shippingAddress.houseNo}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Items Preview */}
                    {order?.orderItems && order.orderItems.length > 0 && (
                        <div className="mb-8 text-left">
                            <h3 className="text-sm font-bold text-navy-500 mb-3 uppercase tracking-wider">Ordered Products</h3>
                            <div className="space-y-3">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                        />
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-sm font-bold text-navy-500 truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-sm font-bold text-navy-500">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
                        <Link
                            to="/orders"
                            className="w-full sm:w-auto btn-primary py-3.5 px-8 rounded-xl font-bold shadow-gold text-sm text-center"
                        >
                            View Order & Track Status
                        </Link>
                        <Link
                            to="/products"
                            className="w-full sm:w-auto py-3.5 px-8 rounded-xl border border-navy-500 text-navy-500 font-bold hover:bg-navy-50 text-sm text-center transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
