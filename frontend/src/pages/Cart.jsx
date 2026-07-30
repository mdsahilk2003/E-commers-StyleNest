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
                            <div key={item.cartId} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <Link to={`/product/${item._id}`} className="flex-shrink-0">
                                        <img
                                            src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <Link to={`/product/${item._id}`}>
                                            <h3 className="text-lg font-semibold text-navy-500 hover:text-gold-500 transition-colors mb-2">
                                                {item.name}
                                            </h3>
                                        </Link>

                                        <div className="text-sm text-gray-600 space-y-1 mb-3">
                                            {item.size && <p>Size: {item.size}</p>}
                                            {item.color && <p>Color: {item.color}</p>}
                                            <p className="text-lg font-bold text-navy-500">
                                                ₹{(item.discountPrice || item.price).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-x border-gray-300">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="text-red-500 hover:text-red-600 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-navy-500">
                                            ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                        </p>
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
