import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Offers', path: '/offers' },
        { name: 'Contact', path: '/contact' },
    ];

    const isAdmin = user && user.role === 'admin';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-4'
            }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="StyleNest Logo" className="h-10 w-auto object-contain rounded-md" />
                        <span className="text-2xl md:text-3xl font-bold text-navy-500 hover:text-gold-500 transition-colors">
                            Style<span className="text-gold-500">Nest</span>
                        </span>
                    </Link>

                    {/* Primary Desktop Navigation */}
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

                    {/* Right Side: Profile Dropdown, Cart, Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <Link to="/cart" className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
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
                                <span className="absolute -top-1 -right-1 bg-gold-500 text-navy-500 text-[11px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {/* Profile Dropdown (Desktop & Mobile Profile Hub) */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-gray-200 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-navy-500 text-white font-bold text-xs flex items-center justify-center">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="hidden md:inline font-bold text-xs text-navy-500 max-w-[100px] truncate">
                                        {user.name}
                                    </span>
                                    {isAdmin && (
                                        <span className="hidden sm:inline-block text-[10px] bg-gold-100 text-gold-800 font-extrabold px-1.5 py-0.5 rounded">
                                            Admin
                                        </span>
                                    )}
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-bold text-navy-500 text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.phone || user.email}</p>
                                            <span
                                                className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                                                    isAdmin ? 'bg-gold-100 text-gold-800' : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {isAdmin ? '👑 Admin Role' : '👤 Customer'}
                                            </span>
                                        </div>

                                        <div className="py-1 text-xs text-navy-500 font-medium">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                            >
                                                <span>👤</span> My Profile & Options
                                            </Link>

                                            {/* Admin Links inside Dropdown */}
                                            {isAdmin ? (
                                                <>
                                                    <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-gray-400">
                                                        Admin Portal
                                                    </div>
                                                    <Link
                                                        to="/admin/orders"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                                    >
                                                        <span>📋</span> Manage Orders
                                                    </Link>
                                                    <Link
                                                        to="/admin/add-product"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                                    >
                                                        <span>➕</span> Add Item
                                                    </Link>
                                                    <Link
                                                        to="/admin/dashboard"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                                    >
                                                        <span>📊</span> Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/admin/stats"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                                    >
                                                        <span>📈</span> Sales Analytics
                                                    </Link>
                                                </>
                                            ) : null}

                                            {/* Customer Links */}
                                            <div className="px-4 pt-2 pb-1 text-[10px] uppercase font-bold text-gray-400">
                                                Shopping
                                            </div>
                                            <Link
                                                to="/orders"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                            >
                                                <span>📦</span> My Orders
                                            </Link>
                                            <Link
                                                to="/addresses"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-gold-600"
                                            >
                                                <span>📍</span> Saved Addresses
                                            </Link>

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-bold"
                                            >
                                                <span>🚪</span> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link to="/login" className="text-navy-500 font-medium hover:text-gold-500 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary py-2 px-4 text-xs">
                                    Signup
                                </Link>
                            </div>
                        )}

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-1.5 rounded-lg text-navy-500 hover:text-gold-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
                        {/* Mobile Profile Card Header */}
                        {user ? (
                            <div className="bg-navy-50 p-3 rounded-xl mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-navy-500 text-white font-bold text-sm flex items-center justify-center">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-500 text-xs">{user.name}</h4>
                                        <p className="text-[10px] text-gray-500">{user.phone || user.email}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-lg"
                                >
                                    Profile 👤
                                </Link>
                            </div>
                        ) : null}

                        <div className="flex flex-col space-y-2 text-xs font-semibold">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-navy-500 hover:text-gold-500 py-2 border-b border-gray-50"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {user ? (
                                <>
                                    {/* Admin Mobile Options */}
                                    {isAdmin && (
                                        <div className="pt-2 space-y-2">
                                            <div className="text-[10px] uppercase font-bold text-gray-400">Admin Options</div>
                                            <Link
                                                to="/admin/orders"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-navy-500 hover:text-gold-600 py-1"
                                            >
                                                📋 Manage Orders
                                            </Link>
                                            <Link
                                                to="/admin/add-product"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-navy-500 hover:text-gold-600 py-1"
                                            >
                                                ➕ Add Item
                                            </Link>
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-navy-500 hover:text-gold-600 py-1"
                                            >
                                                📊 Dashboard
                                            </Link>
                                        </div>
                                    )}

                                    {/* User Mobile Options */}
                                    <div className="pt-2 space-y-2">
                                        <div className="text-[10px] uppercase font-bold text-gray-400">My Account</div>
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-navy-500 hover:text-gold-600 py-1"
                                        >
                                            📦 My Orders
                                        </Link>
                                        <Link
                                            to="/addresses"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-navy-500 hover:text-gold-600 py-1"
                                        >
                                            📍 Saved Addresses
                                        </Link>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-red-600 font-bold py-2 pt-3 border-t border-gray-100"
                                    >
                                        🚪 Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-3 border-t border-gray-200 flex gap-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex-1 text-center py-2 text-navy-500 border border-gray-200 rounded-xl"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex-1 text-center py-2 btn-primary rounded-xl"
                                    >
                                        Signup
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
