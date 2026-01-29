import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PackageCard from '../components/PackageCard';
import ScrollToTop from '../components/ScrollToTop';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';

function CategoryPackages() {
    const { id } = useParams();
    const [packages, setPackages] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="bg-white min-h-screen">
            <Header />

            {/* Editorial Hero Section */}
            <div className="relative h-[75vh] bg-gray-900 flex flex-col justify-center items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                    style={{ backgroundImage: category?.coverImage ? `url('${category.coverImage}')` : "url('/images/hero_beach.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 text-center px-4 w-full max-w-[1920px] mx-auto pt-20">
                    <span className="block text-white font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm animate-fade-in border-b-2 border-white/50 w-fit mx-auto pb-2">
                        EXPLORE COLLECTION
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">
                        {category?.name || 'Category'}
                    </h1>
                    {category?.description && (
                        <div
                            className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed font-light mt-4"
                            dangerouslySetInnerHTML={{ __html: category.description }}
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <section className="relative py-16 px-4 bg-white">
                <div className="max-w-[1920px] mx-auto z-10 px-4 md:px-8">

                    {/* Packages Grid */}
                    {packages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                            {packages.map((pkg, index) => (
                                <div key={pkg._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <PackageCard package={pkg} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32">
                            <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Coming Soon</h3>
                            <p className="text-gray-500 mb-8 font-medium">We are currently curating experiences for this collection.</p>
                            <Link to="/packages" className="inline-block border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest py-3 px-8 hover:bg-gray-900 hover:text-white transition-all duration-300">
                                View Other Collections
                            </Link>
                        </div>
                    )}

                    {/* Custom Inquiry CTA */}
                    <div className="mt-12 text-center border-t border-gray-100 pt-16 max-w-5xl mx-auto">
                        <h3 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight mb-4">
                            Customize This Journey
                        </h3>
                        <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg">
                            Like this destination but want a different itinerary? We specialize in tailor-made experiences. Tell us your preferences, and we'll craft the perfect {category?.name || 'trip'} for you.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block bg-primary-600 text-white font-black uppercase tracking-[0.2em] py-5 px-12 hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            Inquire for Custom Package
                        </button>
                    </div>

                    {/* Flexible Budget Note */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                            * All accommodations & activities can be adjusted to fit your budget.
                        </p>
                    </div>

                </div>
            </section>

            <ContactSection />
            <Footer />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Customize Your Journey"
                maxWidth="max-w-4xl"
            >
                <InquiryForm
                    initialNote={category ? `I'm interested in a custom package for "${category.name}".` : "I'm interested in a custom package."}
                    embedded={true}
                />
            </Modal>
        </div>
    );
}

export default CategoryPackages;
