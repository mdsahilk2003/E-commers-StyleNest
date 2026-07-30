import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const HeroSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await api.get('/banners?type=hero');
            setBanners(data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading) {
        return (
            <div className="h-[500px] md:h-[600px] gradient-navy-black flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (banners.length === 0) {
        // Default hero section if no banners
        return (
            <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-navy-500 via-navy-600 to-black">
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

                {/* Main Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 z-10">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow animate-slide-down">
                            Welcome to <span className="text-gold-500 animate-glow">StyleNest</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up">
                            Premium Quality • Best Prices • Trusted Store
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay">
                            <Link to="/products" className="btn-primary text-lg px-8 py-4">
                                Explore Collection
                            </Link>
                            <Link to="/categories" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-navy-500">
                                View Categories
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gold-500 rounded-full animate-twinkle-delay"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-twinkle-slow"></div>
            </div>
        );
    }

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center">
                        <div className="container-custom">
                            <div className="max-w-2xl text-white animate-slide-up">
                                {banner.subtitle && (
                                    <p className="text-gold-500 text-lg md:text-xl font-semibold mb-2">
                                        {banner.subtitle}
                                    </p>
                                )}
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-shadow">
                                    {banner.title}
                                </h2>
                                {banner.description && (
                                    <p className="text-lg md:text-xl mb-6 text-gray-200">
                                        {banner.description}
                                    </p>
                                )}
                                {banner.discount && (
                                    <p className="text-2xl md:text-3xl font-bold text-gold-500 mb-6">
                                        {banner.discount}% OFF
                                    </p>
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
                </div>
            ))}

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-gold-500 w-8'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSlider;
