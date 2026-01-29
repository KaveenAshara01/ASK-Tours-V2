import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/imageOptimizer';

function CategoryCard({ category }) {
    // Use category image if available, otherwise a placeholder color
    const bgImage = optimizeImage(category.coverImage, 800) || '/images/hero_beach.jpg';

    return (
        <Link
            reloadDocument
            to={`/category/${category._id}`}
            className="group relative block h-[600px] w-full overflow-hidden bg-gray-100"
        >
            {/* Background Image - Sharp and Technical */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />

            {/* Stark Gradient - Bottom only for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

            {/* Editorial Content Layout */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                <div className="relative z-10 border-l-4 border-white pl-6 transition-all duration-300 group-hover:border-primary-500">
                    <span className="block text-white text-xs font-bold tracking-[0.3em] uppercase mb-3 transform transition-transform duration-500 group-hover:-translate-y-1">
                        Collection
                    </span>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-2 font-sans tracking-tighter uppercase leading-none transform transition-transform duration-500 group-hover:-translate-y-1">
                        {category.name}
                    </h3>

                    <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                        <div className="mt-4 flex items-center text-white text-sm font-bold uppercase tracking-widest group-hover:text-primary-400">
                            Explore
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default CategoryCard;
