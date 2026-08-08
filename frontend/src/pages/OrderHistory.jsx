import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Print Invoice Handler
    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const itemsHtml = order.orderItems
            .map(
                (item) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `
            )
            .join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${order._id}</title>
                <style>
                    body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; margin: 20px; line-height: 1.5; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1a202c; padding-bottom: 10px; margin-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #1a202c; }
                    .details-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
                    th { background-color: #f7fafc; text-align: left; padding: 10px; border-bottom: 2px solid #ddd; }
                    .total-box { margin-left: auto; width: 250px; font-size: 13px; }
                    .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
                    .grand-total { font-weight: bold; border-top: 2px solid #1a202c; padding-top: 8px; font-size: 15px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">StyleNest</div>
                        <div style="font-size: 12px; color: #666;">Premium Clothing & Fashion</div>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="margin: 0; color: #1a202c;">INVOICE</h2>
                        <div style="font-size: 12px; color: #666;">Order ID: #${order._id}</div>
                        <div style="font-size: 12px; color: #666;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>

                <div class="details-grid">
                    <div>
                        <strong>Billed & Shipped To:</strong><br/>
                        ${order.shippingAddress?.fullName || 'Customer'}<br/>
                        ${order.shippingAddress?.houseNo || ''}, ${order.shippingAddress?.street || ''}<br/>
                        ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}<br/>
                        Phone: ${order.shippingAddress?.phone || ''}
                    </div>
                    <div style="text-align: right;">
                        <strong>Payment Summary:</strong><br/>
                        Method: ${order.paymentMethod}<br/>
                        Status: ${order.paymentStatus}<br/>
                        Order Status: ${order.status}
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="total-box">
                    <div class="total-row"><span>Subtotal:</span> <span>₹${(order.itemsPrice || 0).toFixed(2)}</span></div>
                    <div class="total-row"><span>Tax (GST):</span> <span>₹${(order.taxPrice || 0).toFixed(2)}</span></div>
                    <div class="total-row"><span>Shipping:</span> <span>₹${(order.shippingPrice || 0).toFixed(2)}</span></div>
                    <div class="total-row grand-total"><span>Grand Total:</span> <span>₹${order.totalPrice.toFixed(2)}</span></div>
                </div>

                <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                    Thank you for shopping with StyleNest! For support, contact info@stylenest.com
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
    };

    const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

    const getStepIndex = (status) => {
        if (status === 'Cancelled' || status === 'Returned') return -1;
        return statusSteps.indexOf(status);
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container-custom max-w-5xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-navy-500 mb-2">My Orders</h1>
                <p className="text-sm text-gray-600 mb-8">View your order history, track deliveries, and download invoices</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500 mx-auto"></div>
                        <p className="mt-3 text-sm text-gray-500">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 max-w-md mx-auto my-8">
                        <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            📦
                        </div>
                        <h3 className="text-lg font-bold text-navy-500 mb-1">No Orders Yet</h3>
                        <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet. Discover our collection now!</p>
                        <Link to="/products" className="btn-primary py-3 px-6 rounded-xl font-bold text-sm">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const currentStepIdx = getStepIndex(order.status);
                            const isCancelled = order.status === 'Cancelled';

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-gray-300"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gray-50 p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div>
                                                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Order Placed</span>
                                                <span className="font-bold text-navy-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Total</span>
                                                <span className="font-extrabold text-gold-600">₹{order.totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Payment Method</span>
                                                <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    order.paymentStatus === 'PAID'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                Payment: {order.paymentStatus}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    isCancelled
                                                        ? 'bg-red-100 text-red-700'
                                                        : order.status === 'Delivered'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-4 sm:p-6">
                                        <div className="mb-4">
                                            <span className="text-xs font-semibold text-gray-400 block mb-2">Order ID: #{order._id}</span>
                                            <div className="space-y-3">
                                                {order.orderItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                                                        />
                                                        <div className="flex-grow min-w-0">
                                                            <h4 className="font-bold text-navy-500 text-sm truncate">{item.name}</h4>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <span className="font-bold text-navy-500 text-sm">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tracking Timeline Stepper */}
                                        {!isCancelled && (
                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <h4 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-4">
                                                    Tracking Progress
                                                </h4>

                                                <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto px-2">
                                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                                                    <div
                                                        className="absolute top-1/2 left-0 h-1 bg-gold-500 -translate-y-1/2 z-0 transition-all duration-500"
                                                        style={{
                                                            width: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%`,
                                                        }}
                                                    ></div>

                                                    {statusSteps.map((stepName, stepIdx) => {
                                                        const isCompleted = currentStepIdx >= stepIdx;
                                                        const isCurrent = currentStepIdx === stepIdx;

                                                        return (
                                                            <div key={stepName} className="relative z-10 flex flex-col items-center">
                                                                <div
                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                                                        isCompleted
                                                                            ? 'bg-gold-500 text-white ring-4 ring-gold-100'
                                                                            : 'bg-gray-200 text-gray-500'
                                                                    } ${isCurrent ? 'scale-125' : ''}`}
                                                                >
                                                                    {isCompleted ? '✓' : stepIdx + 1}
                                                                </div>
                                                                <span
                                                                    className={`text-[10px] mt-2 text-center max-w-[70px] font-semibold ${
                                                                        isCompleted ? 'text-navy-500' : 'text-gray-400'
                                                                    }`}
                                                                >
                                                                    {stepName}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-navy-500 hover:text-gold-600 text-xs font-bold flex items-center gap-1"
                                            >
                                                <span>📋 View Full Details & Address</span>
                                            </button>
                                            <button
                                                onClick={() => handlePrintInvoice(order)}
                                                className="btn-primary py-2 px-4 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                                            >
                                                <span>📄 Download Invoice</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 my-8 relative">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-navy-500">Order Details</h3>
                                <p className="text-xs text-gray-500">#{selectedOrder._id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-navy-500 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="font-bold text-navy-500 block mb-1">Shipping Address</span>
                                <p className="font-semibold text-gray-800">
                                    {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})
                                </p>
                                <p className="text-gray-600">
                                    {selectedOrder.shippingAddress?.houseNo}, {selectedOrder.shippingAddress?.street},{' '}
                                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                                    {selectedOrder.shippingAddress?.zipCode}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between">
                                <div>
                                    <span className="text-gray-500 block">Payment Method</span>
                                    <span className="font-bold text-navy-500">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Payment Status</span>
                                    <span className="font-bold text-green-700">{selectedOrder.paymentStatus}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Order Status</span>
                                    <span className="font-bold text-navy-500">{selectedOrder.status}</span>
                                </div>
                            </div>

                            <div>
                                <span className="font-bold text-navy-500 block mb-2">Items</span>
                                <div className="space-y-2">
                                    {selectedOrder.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={() => handlePrintInvoice(selectedOrder)}
                                className="btn-primary py-2 px-4 rounded-xl text-xs font-bold"
                            >
                                Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
