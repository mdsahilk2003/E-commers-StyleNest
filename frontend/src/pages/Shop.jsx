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

    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);

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

    const selectedCategoryObj = categories.find((c) => c._id === filters.category);

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-24 md:pb-12 bg-gray-50">
            <div className="container-custom">
                {/* Top Search Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by product name, saree, shirt, suit..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                        />
                        {filters.search && (
                            <button
                                type="button"
                                onClick={() => handleFilterChange('search', '')}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-navy-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-500 mb-1 sm:mb-2">
                        Shop All Products
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Discover our complete collection of premium clothing
                    </p>
                </div>

                {/* Desktop Filters (Hidden on Mobile) */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-navy-500 mb-2">
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
                            <label className="block text-sm font-semibold text-navy-500 mb-2">
                                Sort By
                            </label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="input-field"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(filters.category || filters.search) && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            <button onClick={clearFilters} className="text-gold-600 hover:text-gold-700 font-semibold text-sm">
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Active Filters Badge Bar */}
                {(filters.category || filters.search) && (
                    <div className="flex md:hidden items-center flex-wrap gap-2 mb-4">
                        <span className="text-xs text-gray-500">Active Filters:</span>
                        {filters.search && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gold-100 text-navy-600 px-2.5 py-1 rounded-full border border-gold-300 font-medium">
                                "{filters.search}"
                                <button onClick={() => handleFilterChange('search', '')} className="text-navy-500 hover:text-red-500">
                                    ✕
                                </button>
                            </span>
                        )}
                        {selectedCategoryObj && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gold-100 text-navy-600 px-2.5 py-1 rounded-full border border-gold-300 font-medium">
                                {selectedCategoryObj.name}
                                <button onClick={() => handleFilterChange('category', '')} className="text-navy-500 hover:text-red-500">
                                    ✕
                                </button>
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-xs text-gold-600 font-semibold underline ml-auto">
                            Clear All
                        </button>
                    </div>
                )}

                {/* Products Count */}
                {!loading && (
                    <div className="mb-4 text-xs sm:text-sm text-gray-600 flex justify-between items-center">
                        <span>Showing <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}</span>
                    </div>
                )}

                {/* Products Grid (2 columns on mobile, 3 on md, 4 on lg) */}
                {loading ? (
                    <Loading />
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="No products found"
                        icon="🔍"
                        action={{ label: 'Clear Filters', onClick: clearFilters }}
                    />
                )}
            </div>

            {/* Mobile Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex items-center justify-around py-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden">
                <button
                    type="button"
                    onClick={() => setIsSortDrawerOpen(true)}
                    className="flex items-center justify-center gap-2 flex-1 font-semibold text-navy-500 hover:text-gold-500 text-sm"
                >
                    <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <span>Sort</span>
                    <span className="text-[10px] text-gray-400 font-normal truncate max-w-[70px]">
                        ({filters.sort === 'price-asc' ? 'Low-High' : filters.sort === 'price-desc' ? 'High-Low' : 'Newest'})
                    </span>
                </button>

                <div className="h-6 w-px bg-gray-200"></div>

                <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center justify-center gap-2 flex-1 font-semibold text-navy-500 hover:text-gold-500 text-sm relative"
                >
                    <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Filter</span>
                    {(filters.category || filters.search) && (
                        <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></span>
                    )}
                </button>
            </div>

            {/* Mobile Filter Drawer (Bottom Sheet) */}
            {isFilterDrawerOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsFilterDrawerOpen(false)}
                    />

                    {/* Sheet Content */}
                    <div className="relative bg-white rounded-t-2xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto animate-drawer-up">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                            <h3 className="text-lg font-bold text-navy-500">Filter Products</h3>
                            <button
                                onClick={() => setIsFilterDrawerOpen(false)}
                                className="p-1 rounded-full text-gray-400 hover:text-navy-500 hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-navy-500 mb-2">Search Query</label>
                            <input
                                type="text"
                                placeholder="Search by name or style..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Categories Selection Chips */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-navy-500 mb-3">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('category', '')}
                                    className={`px-3 py-2 text-xs font-medium rounded-full transition-colors ${
                                        filters.category === ''
                                            ? 'bg-navy-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        type="button"
                                        onClick={() => handleFilterChange('category', cat._id)}
                                        className={`px-3 py-2 text-xs font-medium rounded-full transition-colors ${
                                            filters.category === cat._id
                                                ? 'bg-gold-500 text-navy-500 font-bold shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    clearFilters();
                                    setIsFilterDrawerOpen(false);
                                }}
                                className="btn-outline flex-1 py-3 text-sm"
                            >
                                Clear All
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFilterDrawerOpen(false)}
                                className="btn-primary flex-1 py-3 text-sm"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sort Drawer (Bottom Sheet) */}
            {isSortDrawerOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSortDrawerOpen(false)}
                    />

                    {/* Sheet Content */}
                    <div className="relative bg-white rounded-t-2xl shadow-2xl p-6 z-10 max-h-[60vh] overflow-y-auto animate-drawer-up">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                            <h3 className="text-lg font-bold text-navy-500">Sort Products By</h3>
                            <button
                                onClick={() => setIsSortDrawerOpen(false)}
                                className="p-1 rounded-full text-gray-400 hover:text-navy-500 hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-2 mb-4">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        handleFilterChange('sort', option.value);
                                        setIsSortDrawerOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                                        filters.sort === option.value
                                            ? 'border-gold-500 bg-gold-50/50 text-navy-500 font-bold'
                                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {filters.sort === option.value && (
                                        <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
