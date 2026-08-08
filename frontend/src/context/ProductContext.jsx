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
                { _id: 'Sarees', name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', description: 'Beautiful premium sarees' },
                { _id: 'Shirts', name: "Male Shirts", image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', description: 'Classic & modern men shirts' },
                { _id: 'Suits', name: 'Suits', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', description: 'Designer suits' },
                { _id: 'Lehengas', name: 'Lehengas', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', description: 'Stunning lehengas' },
                { _id: 'Kurtis', name: 'Kurtis', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800', description: 'Comfortable & stylish kurtis' },
                { _id: 'Dress Materials', name: 'Dress Materials', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800', description: 'Premium materials' },
                { _id: 'Accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800', description: 'Fashion accessories' },
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
