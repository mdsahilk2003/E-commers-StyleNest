import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import Loading from '../components/Loading';
import api from '../utils/api';
import { useProducts } from '../context/ProductContext';

const Offers = () => {
    const { products, loading: productsLoading } = useProducts();
    const [offerBanners, setOfferBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOfferBanners();
    }, []);

    const fetchOfferBanners = async () => {
        try {
            const { data } = await api.get('/banners?type=offer');
            setOfferBanners(data);
        } catch (error) {
            console.error('Failed to fetch offer banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const discountedProducts = products.filter((p) => p.discountPrice && p.discountPrice < p.price);

    if (loading || productsLoading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
                        Special Offers
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don't miss out on our amazing deals and discounts
                    </p>
                </div>

                {/* Offer Banners */}
                {offerBanners.length > 0 && (
                    <div className="space-y-8 mb-12">
                        {offerBanners.map((banner) => (
                            <div
                                key={banner._id}
                                className="relative rounded-lg overflow-hidden shadow-lg"
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
                                </div>

                                <div className="relative p-8 md:p-12">
                                    <div className="max-w-2xl text-white">
                                        {banner.subtitle && (
                                            <p className="text-gold-500 text-lg md:text-xl font-semibold mb-2">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                            {banner.title}
                                        </h2>
                                        {banner.description && (
                                            <p className="text-lg md:text-xl mb-6 text-gray-200">
                                                {banner.description}
                                            </p>
                                        )}
                                        {banner.discount && (
                                            <p className="text-3xl md:text-5xl font-bold text-gold-500 mb-6">
                                                {banner.discount}% OFF
                                            </p>
                                        )}
                                        {banner.endDate && (
                                            <div className="mb-6">
                                                <p className="text-sm mb-3">Offer ends in:</p>
                                                <CountdownTimer endDate={banner.endDate} />
                                            </div>
                                        )}
                                        <Link
                                            to={banner.buttonLink || '/products'}
                                            className="btn-primary text-lg px-8 py-4 inline-block"
                                        >
                                            {banner.buttonText || 'Shop Now'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Discounted Products */}
                {discountedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-navy-500 mb-6">
                            Products on Sale
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {discountedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {offerBanners.length === 0 && discountedProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600 mb-6">
                            No active offers at the moment. Check back soon!
                        </p>
                        <Link to="/products" className="btn-primary">
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Offers;
