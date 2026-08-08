import { Link } from 'react-router-dom';

import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import Loading from '../components/Loading';
import { useProducts } from '../context/ProductContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Home = () => {
    const { products, categories, loading } = useProducts();
    const [offerBanner, setOfferBanner] = useState(null);

    const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

    useEffect(() => {
        fetchOfferBanner();
    }, []);

    const fetchOfferBanner = async () => {
        try {
            const { data } = await api.get('/banners?type=offer');
            if (data.length > 0) {
                setOfferBanner(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch offer banner:', error);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen">
            {/* Premium Hero Banner Section */}
            <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                {/* Animated Background Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Floating Circles */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/20 rounded-full blur-3xl animate-float-slow"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl animate-float-slower"></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float"></div>

                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/5 to-transparent animate-shimmer"></div>

                    {/* Geometric Shapes */}
                    <div className="absolute top-10 right-20 w-20 h-20 border-2 border-gold-500/30 rotate-45 animate-spin-slow"></div>
                    <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-white/20 animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gold-500/20 rotate-12 animate-bounce-slow"></div>
                </div>

                {/* Banner Image */}
                <div className="absolute inset-0">
                    <img
                        src="/assets/hero-banner.png"
                        alt="Premium Fashion Collection"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Banner Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="w-full p-6 sm:p-8 md:p-12 lg:p-16 z-10">
                        <div className="max-w-3xl">
                            <p className="text-gold-500 text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 animate-fade-in">
                                EXCLUSIVE COLLECTION
                            </p>
                            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight text-shadow animate-slide-down">
                                Elevate Your Style with <span className="text-gold-500 animate-glow">Premium Fashion</span>
                            </h1>
                            <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-2xl animate-fade-in-up">
                                Discover our curated collection of luxury clothing designed for the modern individual
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up-delay">
                                <Link to="/products" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-center">
                                    Explore Collection
                                </Link>
                                <Link to="/categories" className="btn-outline text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-center border-white text-white hover:bg-white hover:text-navy-500">
                                    View Categories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gold-500 rounded-full animate-twinkle-delay"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-twinkle-slow"></div>
            </section>

            {/* Categories Section */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore our curated collection of premium clothing
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.slice(0, 3).map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>


                </div>
            </section>

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <section className="section-padding">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
                                Featured Products
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Handpicked favorites just for you
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>


                    </div>
                </section>
            )}



            {/* Offer Banner Section */}
            {offerBanner && offerBanner.endDate && (
                <section className="section-padding gradient-navy-black">
                    <div className="container-custom">
                        <div className="text-center text-white">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                {offerBanner.title}
                            </h2>
                            {offerBanner.subtitle && (
                                <p className="text-xl md:text-2xl text-gold-500 mb-6">
                                    {offerBanner.subtitle}
                                </p>
                            )}
                            {offerBanner.discount && (
                                <p className="text-4xl md:text-6xl font-bold text-gold-500 mb-8">
                                    {offerBanner.discount}% OFF
                                </p>
                            )}
                            <div className="mb-8">
                                <CountdownTimer endDate={offerBanner.endDate} />
                            </div>
                            <Link
                                to={offerBanner.buttonLink || '/offers'}
                                className="btn-primary text-lg px-8 py-4 inline-block"
                            >
                                {offerBanner.buttonText || 'Shop Now'}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Why Choose Us Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
                            Why Choose Us
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gold-500 rounded-full flex items-center justify-center group-hover:shadow-gold-lg transition-all duration-300 group-hover:scale-110">
                                <svg
                                    className="w-10 h-10 text-navy-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-navy-500 mb-2">
                                Premium Quality
                            </h3>
                            <p className="text-gray-600">
                                Only the finest materials and craftsmanship
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gold-500 rounded-full flex items-center justify-center group-hover:shadow-gold-lg transition-all duration-300 group-hover:scale-110">
                                <svg
                                    className="w-10 h-10 text-navy-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-navy-500 mb-2">
                                Best Price
                            </h3>
                            <p className="text-gray-600">
                                Competitive pricing without compromising quality
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gold-500 rounded-full flex items-center justify-center group-hover:shadow-gold-lg transition-all duration-300 group-hover:scale-110">
                                <svg
                                    className="w-10 h-10 text-navy-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-navy-500 mb-2">
                                Trusted Store
                            </h3>
                            <p className="text-gray-600">
                                Thousands of satisfied customers worldwide
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gold-500 rounded-full flex items-center justify-center group-hover:shadow-gold-lg transition-all duration-300 group-hover:scale-110">
                                <svg
                                    className="w-10 h-10 text-navy-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-navy-500 mb-2">
                                Easy Returns
                            </h3>
                            <p className="text-gray-600">
                                Hassle-free returns within 30 days
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
