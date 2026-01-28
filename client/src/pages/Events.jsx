import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ContactSection from '../components/ContactSection';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/events').then(res => {
            setEvents(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <SEO title="Upcoming Events - ASK Travels" description="Join us for special cultural events and seasonal gatherings in Sri Lanka." />
            <Header />

            {/* Premium Hero */}
            <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105" style={{ backgroundImage: "url('/images/hero_culture.jpg')" }}></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div className="relative z-20 text-center text-white px-4 max-w-[1920px] mx-auto">
                    <span className="block font-bold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm animate-fade-in text-secondary-500">
                        Calendar
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                        Upcoming Events
                    </h1>
                    <div className="w-24 h-1 bg-white/20 mx-auto rounded-full backdrop-blur-sm"></div>
                </div>
            </div>

            <section className="py-20 px-4 md:px-8 bg-white max-w-[1920px] mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-6">
                        Seasonal Highlights
                    </h2>
                    <p className="text-gray-500 text-lg font-medium">
                        Don't miss out on these limited-time cultural festivals and special tour departures.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {events.map((ev) => {
                            const dateObj = new Date(ev.startDate);
                            const month = dateObj.toLocaleString('default', { month: 'short' });
                            const day = dateObj.getDate();
                            const formattedDay = day < 10 ? `0${day}` : day;

                            const getSuffix = (d) => {
                                if (d > 3 && d < 21) return 'th';
                                switch (d % 10) {
                                    case 1: return "st";
                                    case 2: return "nd";
                                    case 3: return "rd";
                                    default: return "th";
                                }
                            };
                            const suffix = getSuffix(day);

                            return (
                                <Link to={`/events/${ev._id}`} key={ev._id} className="group relative block h-[500px] overflow-hidden bg-gray-900">
                                    {/* Image */}
                                    <img
                                        src={ev.images[0] || '/images/placeholder.jpg'}
                                        alt={ev.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                    {/* Date Badge - Custom Design */}
                                    <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-lg text-center shadow-lg min-w-[80px] transform transition-transform duration-300 group-hover:scale-105">
                                        <div className="flex items-start justify-center leading-none">
                                            <span className="text-4xl font-black text-black tracking-tighter">
                                                {ev.dateType === 'recurring' ? 'R' : formattedDay}
                                            </span>
                                            {ev.dateType !== 'recurring' && (
                                                <span className="text-sm font-bold text-black mt-1">
                                                    {suffix}
                                                </span>
                                            )}
                                        </div>
                                        <span className="block text-sm font-black text-black uppercase tracking-widest mt-1">
                                            {ev.dateType === 'recurring' ? 'Auto' : month.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                                        <div className="border-l-4 border-secondary-500 pl-6 transform transition-all duration-300 group-hover:border-white">
                                            <span className="block text-gray-300 text-xs font-bold tracking-[0.2em] uppercase mb-3">
                                                {ev.location}
                                            </span>
                                            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 font-sans tracking-tight uppercase leading-none">
                                                {ev.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                {ev.shortDescription}
                                            </p>
                                            <div className="flex items-center text-secondary-500 text-xs font-bold uppercase tracking-widest mt-2 group-hover:text-white transition-colors">
                                                View Event Details <span className="ml-2">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Custom Inquiry CTA */}
            <div className="py-24 bg-gray-50 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-6">
                        Plan Around an Event?
                    </h3>
                    <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
                        Want to time your visit for a specific festival? We can build a custom itinerary around these dates.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-block bg-primary-600 text-white font-black uppercase tracking-[0.2em] py-5 px-12 hover:bg-secondary-500 hover:text-primary-950 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-none"
                    >
                        Start Planning
                    </button>
                </div>
            </div>

            <ContactSection />
            <Footer />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Event Inquiry" maxWidth="max-w-4xl">
                <InquiryForm initialNote="I want to plan my trip around a specific event." embedded={true} />
            </Modal>
        </div>
    );
}

export default Events;
