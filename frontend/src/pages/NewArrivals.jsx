import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductContext';
import { useEffect } from 'react';

const NewArrivals = () => {
    const { products, loading, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts({ isNewArrival: 'true' });
    }, []);

    const newArrivals = products.filter((p) => p.isNewArrival);

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
                        New Arrivals
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the latest additions to our collection
                    </p>
                </div>

                {loading ? (
                    <Loading />
                ) : newArrivals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="No new arrivals at the moment"
                        icon="✨"
                        action={{ label: 'Browse All Products', onClick: () => window.location.href = '/products' }}
                    />
                )}
            </div>
        </div>
    );
};

export default NewArrivals;
