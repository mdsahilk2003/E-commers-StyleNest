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

    const staticProducts = [
        {
            _id: '1',
            name: 'Premium Cotton T-Shirt',
            description: 'High-quality cotton t-shirt with modern fit. Perfect for casual wear and everyday comfort.',
            price: 1299,
            discountPrice: 999,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Navy'],
            stock: 50,
            category: 'Shirts',
            isNewArrival: true,
            isFeatured: true,
        },
        {
            _id: '2',
            name: 'Classic Denim Jeans',
            description: 'Stylish denim jeans with perfect fit. Durable fabric that lasts for years.',
            price: 2499,
            discountPrice: 1899,
            images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
            sizes: ['28', '30', '32', '34'],
            colors: ['Blue', 'Black'],
            stock: 35,
            category: 'Jeans',
            isNewArrival: true,
            isFeatured: true,
        },
        {
            _id: '3',
            name: 'Leather Sneakers',
            description: 'Premium leather sneakers for ultimate comfort. Perfect for daily wear.',
            price: 3999,
            discountPrice: 2999,
            images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'],
            sizes: ['7', '8', '9', '10'],
            colors: ['White', 'Black'],
            stock: 25,
            category: 'Shoes',
            isNewArrival: false,
            isFeatured: true,
        },
        {
            _id: '4',
            name: 'Formal Shirt',
            description: 'Elegant formal shirt for office and events. Wrinkle-free fabric.',
            price: 1799,
            discountPrice: 1299,
            images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['White', 'Blue'],
            stock: 40,
            category: 'Shirts',
            isNewArrival: true,
            isFeatured: false,
        },
    ];

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(filters).toString();
            const { data } = await api.get(`/products?${params}`);
            if (Array.isArray(data) && data.length > 0) {
                setProducts(data);
            } else {
                setProducts(staticProducts);
            }
        } catch (err) {
            console.warn('Backend API products notice, using sample fallback:', err.message);
            setError(null);
            setProducts(staticProducts);
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
