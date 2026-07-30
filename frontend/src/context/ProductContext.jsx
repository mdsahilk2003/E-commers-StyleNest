import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(filters).toString();
            const { data } = await api.get(`/products?${params}`);
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const staticCategories = [
                { _id: 'Sarees', name: 'Sarees', image: 'https://images.unsplash.com/photo-1583391733958-d69818ab8df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Beautiful premium sarees' },
                { _id: 'Suits', name: 'Suits', image: 'https://images.unsplash.com/photo-1620857367258-7501a1d1f057?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Designer suits' },
                { _id: 'Lehengas', name: 'Lehengas', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Stunning lehengas' },
                { _id: 'Kurtis', name: 'Kurtis', image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Comfortable & stylish kurtis' },
                { _id: 'Dress Materials', name: 'Dress Materials', image: 'https://images.unsplash.com/photo-1584286595398-a32f22e8316c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Premium materials' },
                { _id: 'Accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Fashion accessories' },
                { _id: 'Other', name: 'Other', image: 'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', description: 'Other items' },
            ];
            setCategories(staticCategories);
        } catch (err) {
            console.error('Failed to prepare categories:', err);
        }
    };

    const getProductById = async (id) => {
        try {
            const { data } = await api.get(`/products/${id}`);
            return data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to fetch product');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const value = {
        products,
        categories,
        loading,
        error,
        fetchProducts,
        fetchCategories,
        getProductById,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
