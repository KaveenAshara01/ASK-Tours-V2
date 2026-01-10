
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import MediaCarousel from '../components/MediaCarousel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css'; // Use bubble theme for read-only view
import Header from '../components/Header';
import Footer from '../components/Footer';

function PackageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`/api/packages/${id}`);
                setPkg(response.data);
            } catch (err) {
                console.error('Error fetching package:', err);
                setError('Failed to load package details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPackage();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-xl text-red-600 mb-4">{error || 'Package not found'}</div>
                <button
                    onClick={() => navigate('/packages')}
                    className="btn-primary"
                >
                    Back to Packages
                </button>
            </div>
        );
    }

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(pkg.price);

    // Prepare media
    const images = pkg.images && pkg.images.length > 0
        ? pkg.images
        : pkg.image
            ? [pkg.image]
            : [];
    const videos = pkg.videos || [];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <SEO
                title={pkg.title}
                description={`Book your ${pkg.title} tour today! Price: ${formattedPrice}. An unforgettable wildlife adventure awaiting you.`}
                image={images[0]}
            />
            <Header />

            <div className="flex-grow pb-20">
                {/* Hero Section / Media Carousel */}
                <div className="relative h-[50vh] md:h-[70vh] bg-black">
                    <MediaCarousel
                        images={images}
                        videos={videos}
                        baseUrl="http://localhost:5000"
                        className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 text-white max-w-7xl mx-auto">
                        {pkg.featured && (
                            <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 md:mb-4 inline-block">
                                Featured Experience
                            </span>
                        )}
                        <h1 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-4 leading-tight shadow-sm">
                            {pkg.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 md:gap-6">
                            <span className="text-2xl md:text-3xl font-bold text-primary-400">
                                {formattedPrice}
                            </span>
                            <span className="text-gray-300 text-sm md:text-lg">
                                / per person
                            </span>
                        </div>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8 md:space-y-12">

                            {/* Overview Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                                    Overview
                                </h2>
                                <div className="prose prose-lg text-gray-600 max-w-none">
                                    <ReactQuill
                                        value={pkg.description}
                                        readOnly={true}
                                        theme="bubble"
                                        modules={{ toolbar: false }}
                                    />
                                </div>
                            </div>

                            {/* Itinerary Section */}
                            {pkg.days && pkg.days.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </span>
                                        Itinerary
                                    </h2>

                                    <div className="space-y-6">
                                        {pkg.days.map((day, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
                                            >
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <span className="bg-primary-600 text-white font-bold rounded-lg w-12 h-12 flex items-center justify-center text-xl shadow-md">
                                                            {day.dayNumber}
                                                        </span>
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {day.title || `Day ${day.dayNumber}`}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    <div className="text-gray-600 prose max-w-none">
                                                        <ReactQuill
                                                            value={day.description}
                                                            readOnly={true}
                                                            theme="bubble"
                                                            modules={{ toolbar: false }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar / Booking Card (Placeholder for now) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Tour</h3>
                                    <p className="text-gray-600 mb-6">
                                        Ready for an unforgettable adventure? Contact us to book this package.
                                    </p>
                                    <button className="w-full btn-primary text-lg py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                                        Inquire Now
                                    </button>
                                </div>

                                {/* Quick Info */}
                                <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                                    <h4 className="font-bold text-primary-900 mb-3">Why Choose Us?</h4>
                                    <ul className="space-y-2 text-primary-800 text-sm">
                                        <li className="flex items-center gap-2">✓ Multilingual Guides (EN/RU)</li>
                                        <li className="flex items-center gap-2">✓ Premium Transport</li>
                                        <li className="flex items-center gap-2">✓ 24/7 Support</li>
                                        <li className="flex items-center gap-2">✓ Best Price Guarantee</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default PackageDetails;
