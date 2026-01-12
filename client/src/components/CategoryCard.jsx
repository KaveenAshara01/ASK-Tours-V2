import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
    // Use category image if available, otherwise a placeholder color
    const bgImage = category.coverImage || '/images/hero_beach.jpg';

    return (
        <Link
            to={`/category/${category._id}`}
            className="group relative block h-96 w-full overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-2 font-display tracking-tight drop-shadow-md">
                    {category.name}
                </h3>
                {category.description && (
                    <div
                        className="text-white/80 line-clamp-2 text-sm md:text-base font-light mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 prose prose-invert prose-p:my-0 prose-p:leading-normal"
                        dangerouslySetInnerHTML={{ __html: category.description }}
                    />
                )}
                <div className="inline-flex items-center text-primary-300 font-semibold group-hover:text-primary-400 transition-colors">
                    Explore Packages
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}

export default CategoryCard;
