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
        <Link to={`/product/${product._id}`}>
            <div className="card card-gold-border group relative">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.isNewArrival && (
                        <span className="badge badge-new">NEW</span>
                    )}
                    {hasDiscount && (
                        <span className="badge badge-sale">{discountPercentage}% OFF</span>
                    )}
                </div>

                {/* Product Image */}
                <div className="relative overflow-hidden h-64 bg-gray-100">
                    <img
                        src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Quick Add to Cart Button - Shows on Hover */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-12 
                     opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                     transition-all duration-300 btn-primary whitespace-nowrap"
                    >
                        Add to Cart
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-navy-500 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-navy-500">
                            ₹{displayPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                                ₹{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {product.stock > 0 ? (
                        <p className="text-sm text-green-600 font-medium">In Stock</p>
                    ) : (
                        <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
