import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
    });
    const [previewUrls, setPreviewUrls] = useState([]);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);

    const categories = ['Sarees', 'Suits', 'Lehengas', 'Kurtis', 'Dress Materials', 'Accessories', 'Other'];

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        // Revoke existing preview URLs
        previewUrls.forEach((url) => URL.revokeObjectURL(url));

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
        setSelectedPreviewIndex(0);
        setFormData({ ...formData, images: files });
    };

    const handleRemoveImage = (indexToRemove) => {
        URL.revokeObjectURL(previewUrls[indexToRemove]);
        const updatedPreviews = previewUrls.filter((_, idx) => idx !== indexToRemove);
        const updatedImages = formData.images.filter((_, idx) => idx !== indexToRemove);

        setPreviewUrls(updatedPreviews);
        setFormData({ ...formData, images: updatedImages });

        if (selectedPreviewIndex >= updatedPreviews.length) {
            setSelectedPreviewIndex(Math.max(0, updatedPreviews.length - 1));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);

            formData.images.forEach((image) => {
                data.append('images', image);
            });

            const response = await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Upload success:', response);
            setSuccess('Product added successfully!');
            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err) {
            console.error('Upload error complete payload:', err);
            setError(err.response?.data?.message || 'Failed to add product (Check Console)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom max-w-3xl">
                <div className="mb-8">
                    <button onClick={() => navigate('/admin/dashboard')} className="text-navy-500 hover:text-gold-500 mb-4 transition-colors">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-2">Add New Product</h1>
                    <p className="text-gray-600">Fill in the details to add a new product</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}
                    {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-navy-500 mb-2">Product Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="Enter product name" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy-500 mb-2">Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy-500 mb-2">Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field" rows="4" placeholder="Enter product description" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-navy-500 mb-2">Price (₹) *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input-field" placeholder="0.00" min="0" step="0.01" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy-500 mb-2">Stock Quantity *</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="input-field" placeholder="0" min="0" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy-500 mb-2">Product Images (Max 5)</label>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input-field" />
                        </div>

                        {/* Image Preview Section */}
                        {previewUrls.length > 0 && (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-navy-500">Image Preview</label>
                                
                                {/* Main Image Preview */}
                                <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden border border-gray-300 bg-white flex items-center justify-center">
                                    <img
                                        src={previewUrls[selectedPreviewIndex]}
                                        alt={`Selected preview ${selectedPreviewIndex + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                    <span className="absolute top-2 left-2 bg-navy-500/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        Previewing Image {selectedPreviewIndex + 1} of {previewUrls.length}
                                    </span>
                                </div>

                                {/* Thumbnail Selector */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {previewUrls.map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPreviewIndex(idx)}
                                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedPreviewIndex === idx
                                                        ? 'border-gold-500 ring-2 ring-gold-500/50 scale-105'
                                                        : 'border-gray-300 hover:border-navy-500 opacity-80 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 shadow-md transition-colors"
                                                title="Remove image"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-outline flex-1">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                                {loading ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
