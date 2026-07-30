import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/products?category=${category._id}`}>
            <div className="card card-gold-border group relative overflow-hidden h-64">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={category.image || '/placeholder-category.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>

                {/* Category Name */}
                <div className="relative h-full flex items-end p-6">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                            {category.name}
                        </h3>
                        {category.description && (
                            <p className="text-white/90 text-sm line-clamp-2">
                                {category.description}
                            </p>
                        )}
                        <div className="mt-3 inline-flex items-center text-gold-500 font-semibold hover-underline-gold">
                            Shop Now
                            <svg
                                className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
