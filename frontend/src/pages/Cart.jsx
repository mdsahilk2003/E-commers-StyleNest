import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container-custom">
                    <EmptyState
                        message="Your cart is empty"
                        icon="🛒"
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
                    Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    {/* Product Image & Info */}
                                    <div className="flex gap-3 sm:gap-4 items-start flex-1 min-w-0 w-full sm:w-auto">
                                        <Link to={`/product/${item._id}`} className="flex-shrink-0">
                                            <img
                                                src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                                                alt={item.name}
                                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100"
                                            />
                                        </Link>

                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${item._id}`}>
                                                <h3 className="text-base sm:text-lg font-bold text-navy-500 hover:text-gold-600 transition-colors truncate">
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            <div className="text-xs text-gray-500 space-y-0.5 mt-1">
                                                {item.size && <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium mr-2">Size: {item.size}</span>}
                                                {item.color && <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium">Color: {item.color}</span>}
                                            </div>

                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-500">Price:</span>
                                                <span className="text-sm sm:text-base font-bold text-navy-500">
                                                    ₹{(item.discountPrice || item.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Controls & Item Total */}
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 rounded-l-xl transition-colors font-bold text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1 text-sm font-bold text-navy-500 border-x border-gray-200 bg-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 rounded-r-xl transition-colors font-bold text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="text-right pl-2">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold block sm:hidden">Total</span>
                                            <p className="text-lg sm:text-xl font-extrabold text-navy-500">
                                                ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-navy-500 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-navy-500">
                                        <span>Total</span>
                                        <span>₹{getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link to="/checkout" className="btn-primary w-full text-center block mb-3">
                                Proceed to Checkout
                            </Link>

                            <Link to="/products" className="btn-outline w-full text-center block">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
