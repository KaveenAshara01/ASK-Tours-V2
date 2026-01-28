import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ContactSection from '../components/ContactSection';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';
import PackageCard from '../components/PackageCard';

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [relatedPackages, setRelatedPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const evRes = await axios.get(`/api/events/${id}`);
                setEvent(evRes.data);

                // Fetch packages related to this event
                const pkgRes = await axios.get('/api/packages');
                const relevant = pkgRes.data.filter(p => p.events && p.events.some(e => (typeof e === 'object' ? e._id : e) === id));
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
    if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

    const dateDisplay = event.dateType === 'range'
        ? `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`
        : event.dateType === 'recurring'
            ? event.recurringPattern
            : new Date(event.startDate).toLocaleDateString();

    return (
        <div className="bg-white min-h-screen">
            <SEO title={`${event.title} - ASK Travels`} description={event.shortDescription} />
            <Header />

            {/* Hero */}
            <div className="relative h-[70vh] bg-gray-900 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${event.images[0] || '/images/hero_culture.jpg'}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                    <span className="block font-bold tracking-[0.3em] uppercase mb-4 text-sm text-primary-400">{dateDisplay} • {event.location}</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{event.title}</h1>
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Content Side */}
                <div className="lg:col-span-8">
                    <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: event.description }}></div>

                    {/* Gallery */}
                    {event.images.length > 1 && (
                        <div className="mt-12 grid grid-cols-2 gap-4">
                            {event.images.slice(1).map((img, i) => (
                                <img key={i} src={img} alt={`${event.title} ${i}`} className="rounded-lg object-cover w-full h-64" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 sticky top-24">
                        <h3 className="text-2xl font-bold mb-6">Join This Event</h3>
                        <p className="text-gray-500 mb-8">Secure your spot for this special occasion by booking a package or requesting a custom tour.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full block bg-primary-600 text-white font-bold uppercase tracking-widest py-4 hover:bg-black transition-all text-center"
                        >
                            Book For This Event
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
                <section className="py-20 bg-gray-50 px-4">
                    <div className="max-w-[1920px] mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-4">Packages Including This Event</h2>
                            <p className="text-gray-500">These tours are scheduled or customizable to include {event.title}.</p>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Book for ${event.title}`} maxWidth="max-w-4xl">
                <InquiryForm initialNote={`I would like to attend the "${event.title}" event as part of my tour.`} embedded={true} />
            </Modal>
        </div>
    );
}

export default EventDetails;
