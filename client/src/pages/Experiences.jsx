import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ContactSection from '../components/ContactSection';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';

function Experiences() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/activities').then(res => {
            setActivities(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <SEO title="Experiences - ASK Travels" description="Discover unique activities and experiences in Sri Lanka." />
            <Header />

            {/* Premium Hero */}
            <div className="relative min-h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900 pt-32 md:pt-20">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105" style={{ backgroundImage: "url('/images/hero_beach.jpg')" }}></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div className="relative z-20 text-center text-white px-4 max-w-[1920px] mx-auto">
                    <span className="block font-bold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm animate-fade-in text-secondary-500 notranslate">
                        Unforgettable Moments
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 pb-2 pr-4">
                        Experiences
                    </h1>
                    <div className="w-24 h-1 bg-white/20 mx-auto rounded-full backdrop-blur-sm"></div>
                </div>
            </div>

            <section className="py-20 px-4 md:px-8 bg-white max-w-[1920px] mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-6">
                        Curated Activities
                    </h2>
                    <p className="text-gray-500 text-lg font-medium">
                        From wildlife safaris to ancient temple visits, explore the very best experiences Sri Lanka has to offer.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {activities.map((act, index) => (
                            <Link
                                to={`/experiences/${act._id}`}
                                key={act._id}
                                className="group relative block h-[500px] overflow-hidden bg-gray-200"
                            >
                                {/* Image */}
                                <img
                                    src={act.images[0] || '/images/placeholder.jpg'}
                                    alt={act.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-8">
                                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <span className="inline-block bg-primary-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-3">
                                            {act.location}
                                        </span>
                                        <h3 className="text-3xl font-black text-white mb-2 leading-none uppercase tracking-tight">
                                            {act.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 font-medium">
                                            {act.shortDescription}
                                        </p>

                                        <div className="inline-flex items-center text-secondary-500 text-xs font-black uppercase tracking-widest border-b-2 border-transparent group-hover:border-secondary-500 pb-1 transition-all">
                                            Explore Activity
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Custom Inquiry CTA */}
            <div className="py-24 bg-gray-50 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-6">
                        Looking for something specific?
                    </h3>
                    <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
                        We can arrange any activity you desire. Let us know what you're dreaming of, and we'll make it happen.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-block bg-primary-600 text-white font-black uppercase tracking-[0.2em] py-5 px-12 hover:bg-secondary-500 hover:text-primary-950 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-none"
                    >
                        Request Custom Activity
                    </button>
                </div>
            </div>

            <ContactSection />
            <Footer />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Activity" maxWidth="max-w-4xl">
                <InquiryForm initialNote="I am interested in a specific activity/experience." embedded={true} />
            </Modal>
        </div>
    );
}

export default Experiences;
