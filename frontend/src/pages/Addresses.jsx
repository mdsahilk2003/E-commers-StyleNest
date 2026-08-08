import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        altPhone: '',
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        type: 'Home',
        isDefault: false,
    });

    const navigate = useNavigate();

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/addresses');
            setAddresses(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            altPhone: '',
            houseNo: '',
            street: '',
            landmark: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
            type: 'Home',
            isDefault: false,
        });
        setEditingAddress(null);
        setError('');
    };

    const handleOpenModal = (addr = null) => {
        if (addr) {
            setEditingAddress(addr);
            setFormData({
                fullName: addr.fullName || '',
                phone: addr.phone || '',
                altPhone: addr.altPhone || '',
                houseNo: addr.houseNo || '',
                street: addr.street || '',
                landmark: addr.landmark || '',
                city: addr.city || '',
                state: addr.state || '',
                zipCode: addr.zipCode || '',
                country: addr.country || 'India',
                type: addr.type || 'Home',
                isDefault: addr.isDefault || false,
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.phone || formData.phone.replace(/[^0-9]/g, '').length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        if (!formData.zipCode || formData.zipCode.replace(/[^0-9]/g, '').length < 6) {
            setError('Please enter a valid 6-digit PIN Code');
            return;
        }

        try {
            setSubmitting(true);
            if (editingAddress) {
                await api.put(`/addresses/${editingAddress._id}`, formData);
            } else {
                await api.post('/addresses', formData);
            }
            setShowModal(false);
            resetForm();
            fetchAddresses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save address');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/addresses/${id}`);
            fetchAddresses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.patch(`/addresses/${id}/default`);
            fetchAddresses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update default address');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container-custom max-w-4xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-navy-500">My Addresses</h1>
                        <p className="text-sm text-gray-600">Manage your shipping and delivery addresses</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary py-2.5 px-5 rounded-xl font-semibold shadow-md text-sm flex items-center gap-2"
                    >
                        <span>+ Add New Address</span>
                    </button>
                </div>

                {error && !showModal && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500 mx-auto"></div>
                        <p className="mt-3 text-sm text-gray-500">Loading saved addresses...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            📍
                        </div>
                        <h3 className="text-lg font-bold text-navy-500 mb-1">No Saved Addresses</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                            Save an address to experience faster checkout on StyleNest.
                        </p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn-primary py-3 px-6 rounded-xl font-bold text-sm"
                        >
                            Add Address Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr._id}
                                className={`bg-white rounded-2xl p-6 border shadow-sm relative flex flex-col justify-between transition-all ${
                                    addr.isDefault ? 'border-gold-500 ring-2 ring-gold-500/20' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-navy-500">{addr.fullName}</span>
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                                {addr.type}
                                            </span>
                                        </div>
                                        {addr.isDefault && (
                                            <span className="text-xs bg-gold-100 text-gold-700 font-bold px-2.5 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-1 font-medium">
                                        {addr.houseNo}, {addr.street}
                                    </p>
                                    {addr.landmark && <p className="text-xs text-gray-500 mb-1">Landmark: {addr.landmark}</p>}
                                    <p className="text-sm text-gray-600 mb-2">
                                        {addr.city}, {addr.state} - <span className="font-semibold text-navy-500">{addr.zipCode}</span>
                                    </p>

                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                        <p>📱 Mobile: <span className="font-semibold text-gray-700">{addr.phone}</span></p>
                                        {addr.altPhone && <p>📱 Alt Mobile: {addr.altPhone}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                                    {!addr.isDefault ? (
                                        <button
                                            onClick={() => handleSetDefault(addr._id)}
                                            className="text-gold-600 hover:text-gold-700 font-medium"
                                        >
                                            Set as Default
                                        </button>
                                    ) : (
                                        <span className="text-green-600 font-medium">✓ Default Address</span>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleOpenModal(addr)}
                                            className="text-navy-500 hover:text-gold-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(addr._id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 my-8 relative animate-fadeIn">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-navy-500">
                                {editingAddress ? 'Edit Address' : 'Add New Shipping Address'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-navy-500 text-xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">Mobile Number (10 digits) *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="10-digit Mobile"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">House / Flat / Building No. *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.houseNo}
                                        onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="House / Flat No."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">Street / Area / Colony *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="Street details"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.landmark}
                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="Nearby landmark"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="City"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">State *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">PIN Code (6 digits) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="PIN Code"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">Address Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input-field py-2"
                                    >
                                        <option value="Home">Home (All day delivery)</option>
                                        <option value="Work">Work (10 AM - 6 PM delivery)</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-500 mb-1">Alternate Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        value={formData.altPhone}
                                        onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                                        className="input-field py-2"
                                        placeholder="Alternate Mobile"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isDefaultCheck"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-gold-500 rounded focus:ring-gold-400"
                                />
                                <label htmlFor="isDefaultCheck" className="text-xs text-gray-700 font-medium">
                                    Set as default shipping address
                                </label>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="py-2.5 px-5 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary py-2.5 px-6 rounded-xl font-bold shadow-gold text-xs disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Addresses;
