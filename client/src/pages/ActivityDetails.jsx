import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ContactSection from '../components/ContactSection';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';
import PackageCard from '../components/PackageCard';

function ActivityDetails() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [relatedPackages, setRelatedPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const actRes = await axios.get(`/api/activities/${id}`);
                setActivity(actRes.data);

                const pkgRes = await axios.get('/api/packages');
                const relevant = pkgRes.data.filter(p => p.activities && p.activities.some(a => (typeof a === 'object' ? a._id : a) === id));
                setRelatedPackages(relevant);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!activity) return <div className="min-h-screen flex items-center justify-center">Activity not found</div>;

    return (
        <div className="bg-white min-h-screen font-sans">
            <SEO title={`${activity.title} - ASK Travels`} description={activity.shortDescription} />
            <Header />

            {/* Premium Hero Section */}
            <div className="relative min-h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900 pt-32 md:pt-20">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url('${activity.images[0] || '/images/hero_beach.jpg'}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div className="relative z-20 text-center px-6 max-w-[1920px] mx-auto">
                    <span className="block text-secondary-500 font-bold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm animate-fade-in notranslate">
                        {activity.location}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 pb-2 pr-4 notranslate">
                        {activity.title}
                    </h1>
                    {activity.price > 0 && <p className="text-xl md:text-2xl font-light text-white/90 tracking-wide">Starting from <span className="font-bold text-white">${activity.price}</span></p>}
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto px-4 md:px-12 pt-16 md:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Content Side */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden mb-12">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary-500"></div>
                        <h3 className="text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 text-xs">Activity Overview</h3>
                        <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed font-normal prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black prose-p:mb-6 prose-a:text-primary-600 hover:prose-a:text-primary-700">
                            <div dangerouslySetInnerHTML={{ __html: activity.description }}></div>
                        </div>
                    </div>


                </div>

                {/* Sidebar - Sticky Card */}
                <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-32">
                    <div className="bg-white p-5 md:p-6 shadow-2xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>

                        <h3 className="text-xl font-black text-black uppercase tracking-tight mb-3 relative z-10">Experience This</h3>
                        <p className="text-gray-500 mb-5 font-medium text-sm relative z-10">
                            Add this activity to your custom itinerary. We customize every detail to your preference.
                        </p>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full block bg-primary-600 text-white font-bold uppercase tracking-[0.2em] py-3 hover:bg-secondary-500 hover:text-primary-950 transition-all duration-300 shadow-xl hover:shadow-2xl relative z-10"
                        >
                            Book Experience
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Width Gallery Strip */}
            {activity.images.length > 1 && (
                <div id="gallery-section" className="w-full bg-white">
                    <div className="text-center pt-8 pb-6">
                        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Gallery</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                        {activity.images.map((img, i) => (
                            <div key={i} className="group relative overflow-hidden aspect-square cursor-pointer">
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10"></div>
                                <img
                                    src={img}
                                    alt={`${activity.title} ${i}`}
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
                <section className="py-24 bg-gray-50 px-4 md:px-8 border-t border-gray-100">
                    <div className="max-w-[1920px] mx-auto">
                        <div className="text-center mb-16">
                            <span className="block text-gray-400 font-bold tracking-[0.3em] uppercase mb-4 text-xs">
                                Curated Tours
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">Featured In Packages</h2>
                            <p className="text-gray-500 text-lg">These curated tours include {activity.title} as a highlight.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {relatedPackages.map(pkg => (
                                <PackageCard key={pkg._id} package={pkg} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <ContactSection />
            <Footer />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Book ${activity.title}`} maxWidth="max-w-4xl">
                <InquiryForm initialNote={`I would like to book the "${activity.title}" experience.`} embedded={true} />
            </Modal>
        </div>
    );
}

export default ActivityDetails;
