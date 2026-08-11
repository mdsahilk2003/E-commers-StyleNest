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
            name: 'Formal Men Shirt',
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
        {
            _id: '5',
            name: 'Royal Silk Saree',
            description: 'Handwoven traditional Banarasi silk saree with ornate Zari border detail.',
            price: 5999,
            discountPrice: 4499,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
            sizes: ['Free Size'],
            colors: ['Red', 'Gold', 'Maroon'],
            stock: 20,
            category: 'Sarees',
            isNewArrival: true,
            isFeatured: true,
        },
        {
            _id: '6',
            name: 'Designer Anarkali Suit',
            description: 'Stunning georgette Anarkali suit set with heavy Dupatta embroidery.',
            price: 4999,
            discountPrice: 3499,
            images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
            sizes: ['M', 'L', 'XL'],
            colors: ['Blue', 'Pink', 'Green'],
            stock: 18,
            category: 'Suits',
            isNewArrival: true,
            isFeatured: true,
        },
        {
            _id: '7',
            name: 'Bridal Velvet Lehenga',
            description: 'Exquisite velvet bridal lehenga choli set featuring intricate Zardosi work.',
            price: 12999,
            discountPrice: 9999,
            images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
            sizes: ['Semi-Stitched'],
            colors: ['Red', 'Deep Pink'],
            stock: 10,
            category: 'Lehengas',
            isNewArrival: true,
            isFeatured: true,
        },
        {
            _id: '8',
            name: 'Cotton Printed Kurti',
            description: 'Comfortable 100% pure cotton straight kurti for daily summer wear.',
            price: 1199,
            discountPrice: 799,
            images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Yellow', 'White'],
            stock: 45,
            category: 'Kurtis',
            isNewArrival: false,
            isFeatured: true,
        },
        {
            _id: '9',
            name: 'Unstitched Dress Material',
            description: 'Premium Chanderi cotton unstitched suit material set with chiffon dupatta.',
            price: 2199,
            discountPrice: 1599,
            images: ['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800'],
            sizes: ['Unstitched'],
            colors: ['Purple', 'Peach'],
            stock: 30,
            category: 'Dress Materials',
            isNewArrival: true,
            isFeatured: false,
        },
        {
            _id: '10',
            name: 'Leather Wallet & Belt Set',
            description: 'Genuine leather gift combo set containing classic bi-fold wallet and formal belt.',
            price: 1999,
            discountPrice: 1399,
            images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'],
            sizes: ['One Size'],
            colors: ['Brown', 'Black'],
            stock: 50,
            category: 'Accessories',
            isNewArrival: false,
            isFeatured: true,
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
                let filtered = [...staticProducts];
                if (filters.category) {
                    filtered = filtered.filter(p => 
                        p.category === filters.category || 
                        (typeof p.category === 'object' && p.category?.name === filters.category) ||
                        (typeof p.category === 'object' && p.category?._id === filters.category)
                    );
                }
                if (filters.search) {
                    const s = filters.search.toLowerCase();
                    filtered = filtered.filter(p => 
                        p.name.toLowerCase().includes(s) || 
                        p.description.toLowerCase().includes(s)
                    );
                }
                setProducts(filtered.length > 0 ? filtered : staticProducts);
            }
        } catch (err) {
            console.warn('Backend API products notice, using sample fallback:', err.message);
            setError(null);
            let filtered = [...staticProducts];
            if (filters.category) {
                filtered = filtered.filter(p => 
                    p.category === filters.category || 
                    (typeof p.category === 'object' && p.category?.name === filters.category) ||
                    (typeof p.category === 'object' && p.category?._id === filters.category)
                );
            }
            if (filters.search) {
                const s = filters.search.toLowerCase();
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(s) || 
                    p.description.toLowerCase().includes(s)
                );
            }
            setProducts(filtered.length > 0 ? filtered : staticProducts);
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
