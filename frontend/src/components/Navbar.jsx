import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Offers', path: '/offers' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-lg py-3'
                : 'bg-white/95 backdrop-blur-sm py-4'
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="StyleNest Logo" className="h-10 w-auto object-contain rounded-md" />
                        <span className="text-2xl md:text-3xl font-bold text-navy-500 hover:text-gold-500 transition-colors">
                            Style<span className="text-gold-500">Nest</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-navy-500 font-medium hover:text-gold-500 transition-colors hover-underline-gold pb-1"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Auth & Cart */}
                    <div className="flex items-center space-x-4">
                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            {user ? (
                                <>
                                    {/* Admin Buttons - Only show if user is admin */}
                                    {user.role === 'admin' && (
                                        <>
                                            <Link
                                                to="/admin/add-product"
                                                className="text-navy-500 font-medium hover:text-gold-500 transition-colors"
                                            >
                                                Add Item
                                            </Link>
                                            <Link
                                                to="/admin/dashboard"
                                                className="text-navy-500 font-medium hover:text-gold-500 transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                        </>
                                    )}
                                    {/* Regular user link */}
                                    {user.role !== 'admin' && (
                                        <Link
                                            to="/orders"
                                            className="text-navy-500 font-medium hover:text-gold-500 transition-colors"
                                        >
                                            Orders
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-navy-500 font-medium hover:text-gold-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-navy-500 font-medium hover:text-gold-500 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link to="/signup" className="btn-primary">
                                        Signup
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative hover-scale">
                            <svg
                                className="w-6 h-6 text-navy-500 hover:text-gold-500 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gold-500 text-navy-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-navy-500 hover:text-gold-500 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
                        <div className="flex flex-col space-y-3">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="border-t border-gray-200 pt-3 mt-3">
                                {user ? (
                                    <>
                                        {/* Admin Buttons - Only show if user is admin */}
                                        {user.role === 'admin' && (
                                            <>
                                                <Link
                                                    to="/admin/add-product"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                                >
                                                    Add Item
                                                </Link>
                                                <Link
                                                    to="/admin/dashboard"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                                >
                                                    Dashboard
                                                </Link>
                                            </>
                                        )}
                                        {/* Regular user link */}
                                        {user.role !== 'admin' && (
                                            <Link
                                                to="/orders"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                            >
                                                Orders
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-navy-500 font-medium hover:text-gold-500 transition-colors py-2"
                                        >
                                            Signup
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
