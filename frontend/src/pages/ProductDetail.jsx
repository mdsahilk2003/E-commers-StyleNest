import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById } = useProducts();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Sample products data with Unsplash images
    const sampleProducts = [
        {
            _id: '1',
            name: 'Premium Cotton T-Shirt',
            description: 'High-quality cotton t-shirt with modern fit. Perfect for casual wear and everyday comfort. Made from 100% organic cotton.',
            price: 1299,
            discountPrice: 999,
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Navy', 'Gray'],
            stock: 50,
            category: { name: 'T-Shirts' },
        },
        {
            _id: '2',
            name: 'Classic Denim Jeans',
            description: 'Stylish denim jeans with perfect fit. Durable fabric that lasts for years. Modern slim fit design.',
            price: 2499,
            discountPrice: 1899,
            images: [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
            ],
            sizes: ['28', '30', '32', '34', '36'],
            colors: ['Blue', 'Black', 'Light Blue'],
            stock: 35,
            category: { name: 'Jeans' },
        },
        {
            _id: '3',
            name: 'Leather Sneakers',
            description: 'Premium leather sneakers for ultimate comfort. Perfect for daily wear with superior cushioning and style.',
            price: 3999,
            discountPrice: 2999,
            images: [
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
                'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
            ],
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['White', 'Black', 'Brown'],
            stock: 25,
            category: { name: 'Shoes' },
        },
        {
            _id: '4',
            name: 'Formal Shirt',
            description: 'Elegant formal shirt for office and events. Wrinkle-free fabric with modern collar design.',
            price: 1799,
            discountPrice: 1299,
            images: [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['White', 'Blue', 'Pink', 'Black'],
            stock: 40,
            category: { name: 'Shirts' },
        },
        {
            _id: '5',
            name: 'Sports Running Shoes',
            description: 'High-performance running shoes with advanced cushioning. Lightweight and breathable design.',
            price: 4999,
            discountPrice: 3499,
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
            ],
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['Red', 'Black', 'Blue', 'White'],
            stock: 30,
            category: { name: 'Sports Shoes' },
        },
        {
            _id: '6',
            name: 'Casual Hoodie',
            description: 'Comfortable hoodie for winter season. Soft fleece material with spacious pockets.',
            price: 2199,
            discountPrice: 1599,
            images: [
                'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
                'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'Gray', 'Navy', 'Maroon'],
            stock: 45,
            category: { name: 'Hoodies' },
        },
        {
            _id: '7',
            name: 'Leather Wallet',
            description: 'Genuine leather wallet with multiple card slots. Compact design that fits perfectly in your pocket.',
            price: 1499,
            discountPrice: 999,
            images: [
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
                'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800',
            ],
            sizes: ['One Size'],
            colors: ['Brown', 'Black', 'Tan'],
            stock: 60,
            category: { name: 'Accessories' },
        },
        {
            _id: '8',
            name: 'Designer Sunglasses',
            description: 'Stylish sunglasses with UV protection. Premium frames with polarized lenses.',
            price: 2999,
            discountPrice: 1999,
            images: [
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
            ],
            sizes: ['One Size'],
            colors: ['Black', 'Brown', 'Gold'],
            stock: 20,
            category: { name: 'Accessories' },
        },
        {
            _id: '9',
            name: 'Casual Backpack',
            description: 'Spacious backpack for daily use. Water-resistant material with laptop compartment.',
            price: 2499,
            discountPrice: 1799,
            images: [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
                'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
            ],
            sizes: ['One Size'],
            colors: ['Black', 'Gray', 'Navy', 'Olive'],
            stock: 35,
            category: { name: 'Bags' },
        },
        {
            _id: '10',
            name: 'Formal Leather Shoes',
            description: 'Classic formal shoes for professional look. Genuine leather with cushioned insole.',
            price: 4499,
            discountPrice: 3299,
            images: [
                'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800',
                'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800',
            ],
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['Black', 'Brown', 'Tan'],
            stock: 28,
            category: { name: 'Formal Shoes' },
        },
    ];

    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
            if (data.sizes && data.sizes.length > 0 && !selectedSize) setSelectedSize(data.sizes[0]);
            if (data.colors && data.colors.length > 0 && !selectedColor) setSelectedColor(data.colors[0]);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load product');
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchProduct();
            setLoading(false);
        };
        load();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize, selectedColor);
        alert(`Added ${product.name} to cart!`);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, selectedSize, selectedColor);
        navigate('/checkout');
    };

    const handleDeleteProduct = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${product._id}`);
                alert('Product deleted successfully!');
                navigate('/products');
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        setSubmittingReview(true);

        try {
            await api.post(`/products/${id}/reviews`, {
                rating: userRating,
                comment: userComment
            });
            setReviewSuccess('Feedback submitted successfully!');
            setUserComment('');
            setUserRating(5);
            // Refresh product to show new review
            await fetchProduct();
        } catch (err) {
            console.error('Failed to submit review:', err);
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (error || !product) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-navy-500 mb-4">{error || 'Product not found'}</h2>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Back to Products
                </button>
            </div>
        );
    }

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discount = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-navy-500 hover:text-gold-500 mb-6 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6 md:p-8">
                    {/* Product Images */}
                    <div>
                        {/* Main Image */}
                        <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                                src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}
                                alt={product.name}
                                className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-gold-500 shadow-gold'
                                                : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-navy-500">
                                ₹{hasDiscount ? product.discountPrice : product.price}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                                    <span className="badge badge-sale">{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                        {/* Size Selection */}
                        {product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-navy-500 mb-3">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${selectedSize === size
                                                    ? 'border-gold-500 bg-gold-500 text-navy-500 shadow-gold'
                                                    : 'border-gray-300 text-gray-700 hover:border-gold-500'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-navy-500 mb-3">Select Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${selectedColor === color
                                                    ? 'border-gold-500 bg-gold-500 text-navy-500 shadow-gold'
                                                    : 'border-gray-300 text-gray-700 hover:border-gold-500'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-navy-500 mb-3">Quantity</h3>
                            <div className="flex items-center border-2 border-gray-300 rounded-lg w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x-2 border-gray-300 flex-1 text-center font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{product.stock} items in stock</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button onClick={handleAddToCart} className="btn-outline flex-1 text-lg py-4">
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="btn-primary flex-1 text-lg py-4">
                                Buy Now
                            </button>
                        </div>

                        {/* Admin Options */}
                        {isAdmin && (
                            <div className="flex gap-4 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
                                <Link 
                                    to={`/admin/edit-product/${product._id}`} 
                                    className="btn-secondary flex-1 text-center font-semibold text-lg py-3 flex items-center justify-center"
                                >
                                    Edit Product
                                </Link>
                                <button 
                                    onClick={handleDeleteProduct} 
                                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 flex-1 text-lg"
                                >
                                    Delete Product
                                </button>
                            </div>
                        )}

                        {/* Category */}
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-600">
                                <span className="font-semibold">Category:</span> {typeof product.category === 'object' ? product.category.name : product.category}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews & Feedback Section */}
                <div className="mt-12 bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-navy-500 mb-6">Customer Feedback</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reviews List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-navy-500 mb-4">
                                Reviews ({product.reviews?.length || 0})
                            </h3>
                            
                            {!product.reviews || product.reviews.length === 0 ? (
                                <p className="text-gray-500 italic">No feedback left for this product yet.</p>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {product.reviews.map((review) => (
                                        <div key={review._id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-navy-500">{review.name}</h4>
                                                <div className="flex items-center gap-1 text-gold-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg 
                                                            key={i} 
                                                            className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                                                            viewBox="0 0 24 24" 
                                                            fill="none" 
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.89a1 1 0 00-1.175 0l-3.97 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.89c-.77-.56-.37-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm">{review.comment}</p>
                                            <span className="text-xs text-gray-400 mt-2 block">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Leave a Review Form */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-fit">
                            <h3 className="text-lg font-semibold text-navy-500 mb-4">Leave Feedback</h3>
                            
                            {user ? (
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    {reviewError && (
                                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                                            {reviewError}
                                        </div>
                                    )}
                                    {reviewSuccess && (
                                        <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded text-sm">
                                            {reviewSuccess}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-navy-500 mb-1">Rating</label>
                                        <select 
                                            value={userRating} 
                                            onChange={(e) => setUserRating(Number(e.target.value))}
                                            className="input-field py-2"
                                            required
                                        >
                                            <option value="5">5 Stars - Excellent</option>
                                            <option value="4">4 Stars - Good</option>
                                            <option value="3">3 Stars - Average</option>
                                            <option value="2">2 Stars - Poor</option>
                                            <option value="1">1 Star - Very Poor</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-navy-500 mb-1">Comment</label>
                                        <textarea 
                                            value={userComment} 
                                            onChange={(e) => setUserComment(e.target.value)}
                                            rows="4" 
                                            className="input-field py-2"
                                            placeholder="Write your feedback..."
                                            required
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={submittingReview}
                                        className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-600 mb-4">Please log in to share your feedback.</p>
                                    <Link to="/login" className="btn-primary py-2 px-4 inline-block text-sm">
                                        Log In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
