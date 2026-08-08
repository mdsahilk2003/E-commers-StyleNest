import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Checkout = () => {
    const { cart = [], cartItems = [], getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Use cart or cartItems safely
    const activeCart = Array.isArray(cart) && cart.length > 0 ? cart : (Array.isArray(cartItems) ? cartItems : []);

    // Saved Addresses
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // New/Editing Address Form State
    const [addressForm, setAddressForm] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        altPhone: '',
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        type: 'Home',
        isDefault: true,
    });

    // Payment Selection
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'ONLINE' or 'COD'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentFailed, setPaymentFailed] = useState(false);

    // Fetch user addresses on load
    useEffect(() => {
        const fetchUserAddresses = async () => {
            try {
                setLoadingAddresses(true);
                const { data } = await api.get('/addresses');
                if (Array.isArray(data)) {
                    setAddresses(data);
                    if (data.length > 0) {
                        const defaultAddr = data.find((a) => a.isDefault) || data[0];
                        setSelectedAddressId(defaultAddr._id);
                        setShowAddressForm(false);
                    } else {
                        setShowAddressForm(true);
                    }
                } else {
                    setAddresses([]);
                    setShowAddressForm(true);
                }
            } catch (err) {
                console.error('Failed to fetch addresses:', err);
                setShowAddressForm(true);
            } finally {
                setLoadingAddresses(false);
            }
        };

        if (user) {
            fetchUserAddresses();
        }
    }, [user]);

    // Financial calculations safely
    const subtotal = typeof getCartTotal === 'function' ? getCartTotal() : 0;
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + shipping + tax;

    // Helper utilities for item property extraction
    const getItemId = (item, idx) => item?.product?._id || item?._id || item?.cartId || `item-${idx}`;
    const getItemName = (item) => item?.product?.name || item?.name || 'StyleNest Item';
    const getItemImage = (item) => item?.product?.image || (item?.product?.images && item?.product?.images[0]) || item?.image || (item?.images && item?.images[0]) || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
    const getItemPrice = (item) => Number(item?.product?.discountPrice || item?.product?.price || item?.discountPrice || item?.price || 0);
    const getItemQty = (item) => Number(item?.quantity || 1);

    // Handle Address Form Submission
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setError('');

        const cleanPhone = addressForm.phone ? addressForm.phone.replace(/[^0-9]/g, '') : '';
        if (!cleanPhone || cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        const cleanZip = addressForm.zipCode ? addressForm.zipCode.replace(/[^0-9]/g, '') : '';
        if (!cleanZip || cleanZip.length < 6) {
            setError('Please enter a valid 6-digit PIN Code');
            return;
        }

        try {
            setLoading(true);
            const { data } = await api.post('/addresses', addressForm);
            setAddresses((prev) => [data, ...prev]);
            setSelectedAddressId(data._id);
            setShowAddressForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save shipping address');
        } finally {
            setLoading(false);
        }
    };

    // Selected Address Object
    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    // Order Placement Function
    const handlePlaceOrder = async () => {
        setError('');
        setPaymentFailed(false);

        if (!activeCart || activeCart.length === 0) {
            setError('Your cart is empty. Please add products to checkout.');
            return;
        }

        if (!selectedAddress) {
            setError('Please select or save a valid shipping address before proceeding');
            setShowAddressForm(true);
            return;
        }

        setLoading(true);

        const orderItems = activeCart.map((item, idx) => ({
            product: getItemId(item, idx),
            name: getItemName(item),
            quantity: getItemQty(item),
            image: getItemImage(item),
            price: getItemPrice(item),
            size: item.size || '',
            color: item.color || '',
        }));

        const shippingAddressData = {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            altPhone: selectedAddress.altPhone || '',
            houseNo: selectedAddress.houseNo,
            street: selectedAddress.street,
            landmark: selectedAddress.landmark || '',
            city: selectedAddress.city,
            state: selectedAddress.state,
            zipCode: selectedAddress.zipCode,
            country: selectedAddress.country || 'India',
            type: selectedAddress.type || 'Home',
        };

        if (paymentMethod === 'ONLINE') {
            // Initiate Online Payment Flow
            try {
                const { data: payOrder } = await api.post('/payment/create-online-order', {
                    amount: total,
                });

                // Simulate Online Payment Gateway Window / Verification
                const userConfirmed = window.confirm(
                    `StyleNest Secure Payment Gateway\nTotal Amount: ₹${total.toFixed(2)}\n\nClick OK to simulate SUCCESSFUL payment (UPI / PhonePe / GPay / Card).\nClick Cancel to simulate FAILED payment.`
                );

                if (userConfirmed) {
                    const { data: verifyRes } = await api.post('/payment/verify-online-payment', {
                        razorpay_payment_id: 'pay_' + Date.now(),
                        razorpay_order_id: payOrder.id,
                        paymentStatus: 'SUCCESS',
                        orderData: {
                            orderItems,
                            shippingAddress: shippingAddressData,
                            itemsPrice: subtotal,
                            shippingPrice: shipping,
                            taxPrice: tax,
                            totalPrice: total,
                        },
                    });

                    if (typeof clearCart === 'function') clearCart();
                    navigate(`/order-success/${verifyRes.order._id}`);
                } else {
                    setPaymentFailed(true);
                    setError('Online Payment was cancelled or declined. No order was created.');
                    setLoading(false);
                }
            } catch (err) {
                setPaymentFailed(true);
                setError(err.response?.data?.message || 'Online payment process failed. Please retry.');
                setLoading(false);
            }
        } else {
            // Cash on Delivery (COD) Flow
            try {
                const { data: newOrder } = await api.post('/orders', {
                    orderItems,
                    shippingAddress: shippingAddressData,
                    paymentMethod: 'COD',
                    itemsPrice: subtotal,
                    shippingPrice: shipping,
                    taxPrice: tax,
                    totalPrice: total,
                });

                if (typeof clearCart === 'function') clearCart();
                navigate(`/order-success/${newOrder._id}`);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (!activeCart || activeCart.length === 0) {
        return (
            <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md mx-4">
                    <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        🛒
                    </div>
                    <h2 className="text-xl font-bold text-navy-500 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 text-sm mb-6">Add items to your cart to proceed with checkout.</p>
                    <button onClick={() => navigate('/products')} className="btn-primary py-3 px-6 rounded-xl font-bold text-sm">
                        Explore Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-28 md:pb-16 bg-gray-50">
            <div className="container-custom max-w-6xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-500 mb-6">Checkout</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center justify-between">
                        <div>
                            <span className="font-bold">Error: </span>
                            {error}
                        </div>
                        {paymentFailed && (
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                            >
                                Retry Payment
                            </button>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Address & Payment Selection */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* STEP 1: SHIPPING ADDRESS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-navy-500 flex items-center gap-2">
                                    <span className="w-7 h-7 bg-navy-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                                    Shipping Address
                                </h2>

                                {!showAddressForm && addresses.length > 0 && (
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="text-gold-600 hover:text-gold-700 font-bold text-xs"
                                    >
                                        + Add New Address
                                    </button>
                                )}
                            </div>

                            {loadingAddresses ? (
                                <div className="py-6 text-center text-xs text-gray-500">Loading saved addresses...</div>
                            ) : !showAddressForm && addresses.length > 0 ? (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                selectedAddressId === addr._id
                                                    ? 'border-gold-500 bg-gold-50/20 ring-2 ring-gold-500/20'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="selectedAddress"
                                                        checked={selectedAddressId === addr._id}
                                                        onChange={() => setSelectedAddressId(addr._id)}
                                                        className="w-4 h-4 text-gold-500 focus:ring-gold-400"
                                                    />
                                                    <span className="font-bold text-navy-500 text-sm">{addr.fullName}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                                        {addr.type}
                                                    </span>
                                                </div>
                                                {addr.isDefault && (
                                                    <span className="text-xs bg-gold-100 text-gold-700 font-bold px-2 py-0.5 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <div className="pl-6 pt-2 text-xs text-gray-600 space-y-0.5">
                                                <p>{addr.houseNo}, {addr.street}</p>
                                                {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                                                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                                <p className="font-semibold text-gray-700 pt-1">📱 Mobile: {addr.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* NEW ADDRESS FORM */
                                <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.fullName}
                                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">Mobile Number (10 digits) *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="10-digit Mobile"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">House / Flat No. *</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.houseNo}
                                                onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="House / Flat No."
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">Street / Area *</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.street}
                                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="Street / Colony"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">Landmark (Optional)</label>
                                            <input
                                                type="text"
                                                value={addressForm.landmark}
                                                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="Nearby landmark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="City"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">State *</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.state}
                                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="State"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-navy-500 mb-1">PIN Code (6 digits) *</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.zipCode}
                                                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                                className="input-field py-2"
                                                placeholder="PIN Code"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        {addresses.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressForm(false)}
                                                className="text-gray-500 hover:text-navy-500 font-semibold"
                                            >
                                                Use Saved Address
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary py-2.5 px-6 rounded-xl font-bold text-xs ml-auto shadow-gold"
                                        >
                                            {loading ? 'Saving...' : 'Save & Continue'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* STEP 2: PAYMENT METHOD */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-navy-500 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-7 h-7 bg-navy-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                                Select Payment Method
                            </h2>

                            <div className="space-y-4">
                                {/* ONLINE PAYMENT CONTAINER */}
                                <div
                                    onClick={() => setPaymentMethod('ONLINE')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        paymentMethod === 'ONLINE'
                                            ? 'border-gold-500 bg-gold-50/20 ring-2 ring-gold-500/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'ONLINE'}
                                            onChange={() => setPaymentMethod('ONLINE')}
                                            className="mt-1 w-4 h-4 text-gold-500 focus:ring-gold-400"
                                        />
                                        <div className="flex-grow">
                                            <span className="font-bold text-navy-500 text-sm block">Online Payment (UPI & Cards)</span>
                                            <p className="text-xs text-gray-500 mt-0.5">Instant & Secure Payment Confirmation</p>

                                            {/* Sub-options Badges for PhonePe, GPay, Paytm, Debit Card */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                                                <div className="bg-purple-50 border border-purple-200 text-purple-700 rounded-lg p-2 text-center text-xs font-bold flex items-center justify-center gap-1">
                                                    <span>🟣</span> PhonePe
                                                </div>
                                                <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-2 text-center text-xs font-bold flex items-center justify-center gap-1">
                                                    <span>🌐</span> Google Pay
                                                </div>
                                                <div className="bg-sky-50 border border-sky-200 text-sky-700 rounded-lg p-2 text-center text-xs font-bold flex items-center justify-center gap-1">
                                                    <span>📲</span> Paytm UPI
                                                </div>
                                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-2 text-center text-xs font-bold flex items-center justify-center gap-1">
                                                    <span>💳</span> Debit/Credit Card
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CASH ON DELIVERY */}
                                <div
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                        paymentMethod === 'COD'
                                            ? 'border-gold-500 bg-gold-50/20 ring-2 ring-gold-500/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                        className="mt-1 w-4 h-4 text-gold-500 focus:ring-gold-400"
                                    />
                                    <div>
                                        <span className="font-bold text-navy-500 text-sm block">Cash on Delivery (COD)</span>
                                        <p className="text-xs text-gray-500 mt-0.5">Pay in cash when delivered to your door</p>
                                        <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                                            Pay on Delivery
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                            <h2 className="text-lg font-bold text-navy-500 mb-4 pb-3 border-b border-gray-100">
                                Order Summary ({activeCart.length} {activeCart.length === 1 ? 'item' : 'items'})
                            </h2>

                            <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
                                {activeCart.map((item, idx) => (
                                    <div key={getItemId(item, idx)} className="flex items-center gap-3">
                                        <img
                                            src={getItemImage(item)}
                                            alt={getItemName(item)}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                        />
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-xs font-bold text-navy-500 truncate">{getItemName(item)}</h4>
                                            <p className="text-[11px] text-gray-500">Qty: {getItemQty(item)}</p>
                                        </div>
                                        <span className="text-xs font-bold text-navy-500">
                                            ₹{(getItemPrice(item) * getItemQty(item)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-navy-500">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated GST (5%)</span>
                                    <span className="font-semibold text-navy-500">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-navy-500">
                                        {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200 text-sm font-extrabold text-navy-500">
                                    <span>Grand Total</span>
                                    <span className="text-gold-600 text-base">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Desktop Action Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || showAddressForm}
                                className="hidden md:block w-full btn-primary py-3.5 mt-6 rounded-xl font-bold text-sm shadow-gold disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Pay Now & Place Order' : 'Place COD Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action Bar on Mobile Screens */}
            <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-3 shadow-2xl z-40 md:hidden flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Amount</span>
                    <span className="text-base font-extrabold text-navy-500">₹{total.toFixed(2)}</span>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={loading || showAddressForm}
                    className="flex-grow btn-primary py-3 px-4 rounded-xl font-bold text-xs shadow-gold disabled:opacity-50"
                >
                    {loading ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Pay Now' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
