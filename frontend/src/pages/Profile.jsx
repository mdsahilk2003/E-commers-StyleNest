import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const isAdmin = user && user.role === 'admin';

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const { data } = await api.put('/auth/profile', formData);
            updateUser(data);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md mx-4">
                    <h2 className="text-xl font-bold text-navy-500 mb-2">Please Log In</h2>
                    <p className="text-gray-500 text-sm mb-6">Log in to your account to view your profile and orders.</p>
                    <Link to="/login" className="btn-primary py-3 px-6 rounded-xl font-bold text-sm">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container-custom max-w-5xl mx-auto px-4">
                {/* Header Profile Card */}
                <div className="bg-gradient-to-r from-navy-600 via-navy-500 to-gold-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                        {/* Avatar Initials / Badge */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-navy-600 font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-4 border-white/20">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div className="text-center sm:text-left flex-grow">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-extrabold">{user.name}</h1>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                                        isAdmin ? 'bg-gold-400 text-navy-900 shadow-sm' : 'bg-white/20 text-white'
                                    }`}
                                >
                                    {isAdmin ? '👑 Administrator' : '👤 Customer'}
                                </span>
                            </div>

                            <p className="text-white/80 text-sm flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                                {user.phone && <span>📱 {user.phone}</span>}
                                {user.email && <span>📧 {user.email}</span>}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all border border-white/30"
                                >
                                    {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl mb-6 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Edit Profile Form Modal/Section */}
                {isEditing && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="text-lg font-bold text-navy-500 mb-4 pb-2 border-b border-gray-100">
                            Update Account Details
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold text-navy-500 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-navy-500 mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field py-2"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold text-navy-500 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-navy-500 mb-1">New Password (optional)</label>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep unchanged"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input-field py-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-navy-500 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="btn-primary py-2 px-6 rounded-xl font-bold">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Role Specific Action Options Grid */}
                <div className="space-y-6">
                    {/* Admin Tools Section (Only for Admin) */}
                    {isAdmin && (
                        <div>
                            <h2 className="text-base sm:text-lg font-extrabold text-navy-500 mb-4 flex items-center gap-2">
                                <span>👑</span> Admin Management Portal
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link
                                    to="/admin/orders"
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                        📋
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                            Manage Orders
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            View customer orders, delivery status, and payment updates.
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/add-product"
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                        ➕
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                            Add New Item
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Add new sarees, male shirts, or products to catalog.
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/dashboard"
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                        📊
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                            Admin Dashboard
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Manage inventory, edit pricing, and update stock.
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/stats"
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                        📈
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                            Sales & Performance
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Track overall store revenue and customer analytics.
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Customer Account Options */}
                    <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-navy-500 mb-4 flex items-center gap-2">
                            <span>🛍️</span> My Account Options
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Link
                                to="/orders"
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                    📦
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                        My Orders
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Track order delivery timeline and download invoices.
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/addresses"
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                    📍
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                        Saved Addresses
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Manage default shipping addresses and PIN codes.
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/cart"
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                    🛒
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy-500 text-sm group-hover:text-gold-600 transition-colors">
                                        Shopping Cart
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Review cart items and proceed to checkout.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
