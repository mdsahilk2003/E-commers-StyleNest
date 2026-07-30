import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductContext';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, categories, loading, fetchProducts } = useProducts();
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        sort: searchParams.get('sort') || 'newest',
    });

    useEffect(() => {
        fetchProducts(filters);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ category: '', search: '', sort: 'newest' });
        setSearchParams({});
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-2">
                        Shop All Products
                    </h1>
                    <p className="text-gray-600">
                        Discover our complete collection of premium clothing
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-navy-500 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-navy-500 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-navy-500 mb-2">
                                Sort By
                            </label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="input-field"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(filters.category || filters.search) && (
                        <div className="mt-4">
                            <button onClick={clearFilters} className="text-gold-500 hover:text-gold-600 font-medium">
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <Loading />
                ) : products.length > 0 ? (
                    <>
                        <div className="mb-4 text-gray-600">
                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <EmptyState
                        message="No products found"
                        icon="🔍"
                        action={{ label: 'Clear Filters', onClick: clearFilters }}
                    />
                )}
            </div>
        </div>
    );
};

export default Shop;
