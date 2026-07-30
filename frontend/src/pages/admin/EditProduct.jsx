import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import Loading from '../../components/Loading';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [existingImages, setExistingImages] = useState([]);

    const categories = ['Sarees', 'Suits', 'Lehengas', 'Kurtis', 'Dress Materials', 'Accessories', 'Other'];

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setFormData({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                category: data.category || '',
                stock: data.stock || '',
                images: [], // new images to upload
            });
            setExistingImages(data.images || []);
        } catch (err) {
            console.error('Failed to fetch product:', err);
            setError('Failed to load product details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);

            // If new images are selected, append them
            if (formData.images.length > 0) {
                formData.images.forEach((image) => {
                    data.append('images', image);
                });
            }

            await api.put(`/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setSuccess('Product updated successfully!');
            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom max-w-3xl">
                <div className="mb-8">
                    <button onClick={() => navigate('/admin/dashboard')} className="text-navy-500 hover:text-gold-500 mb-4 transition-colors">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-2">Edit Product</h1>
                    <p className="text-gray-600">Update product information and images</p>
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

                        {/* Existing Images Showcase */}
                        {existingImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-navy-500 mb-2">Current Product Images</label>
                                <div className="flex flex-wrap gap-4">
                                    {existingImages.map((img, idx) => (
                                        <div key={idx} className="w-24 h-24 rounded border overflow-hidden relative group">
                                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-navy-500 mb-2">Upload New Images (Max 5, replaces existing)</label>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input-field" />
                            <p className="text-xs text-gray-500 mt-1">Note: Uploading new images will replace the existing images for this product.</p>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-outline flex-1">Cancel</button>
                            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
