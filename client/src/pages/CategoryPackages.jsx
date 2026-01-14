import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PackageCard from '../components/PackageCard';
import ScrollToTop from '../components/ScrollToTop';
import Header from '../components/Header';

function CategoryPackages() {
    const { id } = useParams();
    const [packages, setPackages] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch category details (We might need an endpoint for single category if not using list, but list filter is fast enough for now or we create getById)
                // Since we didn't explicitly create GET /categories/:id in routes, we might need to rely on packages populated info or add that route.
                // Actually, packageRoutes.js has GET /:id but categoryRoutes has GET /, let's check categoryRoutes again.
                // Ah, categoryRoutes has GET /, but not GET /:id public??? Wait, let me check. 
                // categoryRoutes had PUT /:id and DELETE /:id but looks like I missed GET /:id for public/one. 
                // I will just fetch all categories and find one for now to avoid switching back to backend task, or better, I will implement fetching packages first.

                // Fetch packages by category
                const packagesRes = await axios.get(`/api/packages?category=${id}`);
                setPackages(packagesRes.data);

                // Fetch all categories to find the name (Optimization: Add GET /api/categories/:id later)
                const categoriesRes = await axios.get('/api/categories');
                const currentCat = categoriesRes.data.find(c => c._id === id);
                setCategory(currentCat);

            } catch (err) {
                console.error("Error fetching data", err);
                setError('Failed to load packages. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />



            {/* Header/Hero for Category */}
            <div className="relative min-h-[60vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: category?.coverImage ? `url('${category.coverImage}')` : "url('/images/hero_beach.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/50" />

                {/* Content Container - Relative to take up space */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 pt-44 pb-48 md:pt-36 md:pb-56">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg font-display">
                        {category?.name || 'Category'}
                    </h1>
                    {category?.description && (
                        <div
                            className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-light prose prose-invert prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: category.description }}
                        />
                    )}
                </div>
            </div>

            {/* Main Content with Rounded Top Overlap */}
            <div className="relative -mt-24 z-20 filter drop-shadow-xl">
                <div className="relative pt-12 pb-16 px-4 rounded-t-[3rem] min-h-[50vh] overflow-hidden">

                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                        style={{ backgroundImage: category?.contentImage ? `url('${category.contentImage}')` : (category?.coverImage ? `url('${category.coverImage}')` : "url('/images/hero_beach.jpg')") }}
                    />
                    <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-[2px]"></div>

                    <div className="relative z-10 max-w-7xl mx-auto">




                        {packages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {packages.map((pkg) => (
                                    <PackageCard key={pkg._id} package={pkg} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No packages found</h3>
                                <p className="text-gray-500 mb-6">We don't have any packages in this category yet.</p>
                                <Link to="/" className="btn-primary">
                                    Explore other tours
                                </Link>
                            </div>
                        )}

                        {/* Budget Disclaimer (Bottom) */}
                        <div className="text-center max-w-3xl mx-auto mt-20 mb-8 px-4 border-t border-gray-200 pt-16">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4 ring-4 ring-primary-50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Flexible & Personalized Tours</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We operate businesses across all the budget ranges. accommodations and activities can be fully customized to align with your personal preferences and needs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPackages;
