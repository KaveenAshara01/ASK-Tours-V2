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
            <ScrollToTop />
            <Header />

            {/* Wave Clip Path Definition */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                        <path d="M0,0.02 C0.25,0.1 0.25,0 0.5,0 S0.75,0.1 1,0.02 L1,1 L0,1 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Header/Hero for Category */}
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: category?.coverImage ? `url('${category.coverImage}')` : "url('/images/hero_beach.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
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

            {/* Main Content with Wave Overlap */}
            <div className="relative -mt-24 z-20 filter drop-shadow-xl">
                <div className="bg-gray-50 pt-24 pb-16 px-4 rounded-t-[3rem] md:rounded-none clip-wave-md min-h-[50vh]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-gray-600">
                                Found {packages.length} {packages.length === 1 ? 'package' : 'packages'}
                            </p>
                            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                                &larr; Back to Home
                            </Link>
                        </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPackages;
