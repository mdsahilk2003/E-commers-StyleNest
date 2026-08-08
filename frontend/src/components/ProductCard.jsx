import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const displayPrice = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <Link to={`/product/${product._id}`} className="block h-full">
            <div className="card card-gold-border group relative flex flex-col h-full overflow-hidden">
                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 sm:gap-2">
                    {product.isNewArrival && (
                        <span className="badge badge-new text-[10px] sm:text-xs px-2 py-0.5">NEW</span>
                    )}
                    {hasDiscount && (
                        <span className="badge badge-sale text-[10px] sm:text-xs px-2 py-0.5">{discountPercentage}% OFF</span>
                    )}
                </div>

                {/* Product Image */}
                <div className="relative overflow-hidden h-44 sm:h-64 bg-gray-100 w-full shrink-0">
                    <img
                        src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Desktop Quick Add to Cart Button - Shows on Hover */}
                    <button
                        onClick={handleAddToCart}
                        className="hidden sm:block absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-12 
                     opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                     transition-all duration-300 btn-primary text-sm py-2 px-4 whitespace-nowrap shadow-lg"
                    >
                        Add to Cart
                    </button>

                    {/* Mobile Quick Add Button - Floating Icon */}
                    <button
                        onClick={handleAddToCart}
                        className="sm:hidden absolute bottom-2 right-2 bg-gold-500 text-navy-500 p-2 rounded-full shadow-md active:scale-95 transition-transform"
                        title="Add to Cart"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-grow justify-between">
                    <div>
                        <h3 className="text-xs sm:text-base font-semibold text-navy-500 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors leading-tight">
                            {product.name}
                        </h3>

                        <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <span className="text-sm sm:text-lg font-bold text-navy-500">
                                ₹{displayPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                                <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                    ₹{product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    {product.stock > 0 ? (
                        <p className="text-[10px] sm:text-xs text-green-600 font-medium mt-auto">In Stock</p>
                    ) : (
                        <p className="text-[10px] sm:text-xs text-red-600 font-medium mt-auto">Out of Stock</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
