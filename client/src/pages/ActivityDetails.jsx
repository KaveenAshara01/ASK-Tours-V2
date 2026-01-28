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

                // Fetch packages that include this activity
                // Note: We need to filter manually or add a query param. 
                // Simpler to fetch all packages and filter on client for now, or add backend search.
                // Assuming backend doesn't support ?activity=ID yet, let's fetch all (since dataset is small) or fetch category packages.
                // Better approach: Update backend to support filtering, but for speed, I'll fetch query.
                // Actually, let's just fetch all and filter.
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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    if (!activity) return <div className="min-h-screen flex items-center justify-center">Activity not found</div>;

    return (
        <div className="bg-white min-h-screen">
            <SEO title={`${activity.title} - ASK Travels`} description={activity.shortDescription} />
            <Header />

            {/* Hero */}
            <div className="relative h-[70vh] bg-gray-900 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${activity.images[0] || '/images/hero_beach.jpg'}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                    <span className="block font-bold tracking-[0.3em] uppercase mb-4 text-sm text-primary-400">{activity.location}</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{activity.title}</h1>
                    {activity.price > 0 && <p className="text-2xl font-light">Starting from <span className="font-bold">${activity.price}</span></p>}
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Content Side */}
                <div className="lg:col-span-8">
                    <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: activity.description }}></div>

                    {/* Gallery */}
                    {activity.images.length > 1 && (
                        <div className="mt-12 grid grid-cols-2 gap-4">
                            {activity.images.slice(1).map((img, i) => (
                                <img key={i} src={img} alt={`${activity.title} ${i}`} className="rounded-lg object-cover w-full h-64" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 sticky top-24">
                        <h3 className="text-2xl font-bold mb-6">Experience This</h3>
                        <p className="text-gray-500 mb-8">Add this activity to your custom itinerary or book a package that includes it.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full block bg-primary-600 text-white font-bold uppercase tracking-widest py-4 hover:bg-black transition-all text-center"
                        >
                            Book Experience
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
                <section className="py-20 bg-gray-50 px-4">
                    <div className="max-w-[1920px] mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-4">Featured In Packages</h2>
                            <p className="text-gray-500">These curated tours include {activity.title} as a highlight.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
