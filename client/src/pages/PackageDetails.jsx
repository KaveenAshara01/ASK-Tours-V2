
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import MediaCarousel from '../components/MediaCarousel';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Polyline Decorator Component
function PolylineDecorator({ positions }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !positions || positions.length < 2) return;

        const decorators = [];

        // Create a decorator for each segment to ensure one arrow per connection
        for (let i = 0; i < positions.length - 1; i++) {
            const segment = [positions[i], positions[i + 1]];
            const decorator = L.polylineDecorator(segment, {
                patterns: [
                    {
                        offset: '50%', // Explicitly in the middle of the segment
                        repeat: 0,     // No repetition
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 15, // Slightly larger for visibility since there's only one
                            polygon: false,
                            pathOptions: { stroke: true, weight: 3, color: '#ef4444' }
                        })
                    }
                ]
            }).addTo(map);
            decorators.push(decorator);
        }

        return () => {
            decorators.forEach(d => map.removeLayer(d));
        };
    }, [map, positions]);

    return null;
}

function PackageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false); // State for Gallery Modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State for Inquiry Modal

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



    // Prepare media
    const images = pkg.images && pkg.images.length > 0
        ? pkg.images
        : pkg.image
            ? [pkg.image]
            : [];
    const videos = pkg.videos || [];
    const hasMedia = images.length > 0 || videos.length > 0;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <SEO
                title={pkg.title}
                description={`Book your ${pkg.title} tour today! An unforgettable wildlife adventure awaiting you.`}
                image={images[0]}
            />
            <Header />

            <div className="flex-grow pb-20">
                {/* Hero Section / Media Carousel */}
                <div className="relative h-[50vh] md:h-[70vh] bg-black group">
                    <MediaCarousel
                        images={images}
                        videos={videos}
                        className="h-full w-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-100" // Interactive Effect
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 text-white max-w-7xl mx-auto pointer-events-none">
                        {pkg.featured && (
                            <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 md:mb-4 inline-block shadow-md">
                                Featured Experience
                            </span>
                        )}
                        <h1 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-4 leading-tight shadow-sm drop-shadow-lg">
                            {pkg.title}
                        </h1>

                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8 md:space-y-12">

                            {/* Overview Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Overview
                                    </h2>
                                    {hasMedia && (
                                        <button
                                            onClick={() => setIsGalleryOpen(true)}
                                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors bg-primary-50 px-4 py-2 rounded-lg hover:bg-primary-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="hidden sm:inline">View Photos ({images.length + videos.length})</span>
                                            <span className="sm:hidden">Photos ({images.length + videos.length})</span>
                                        </button>
                                    )}
                                </div>
                                <div className="prose prose-lg text-gray-600 max-w-none">
                                    <div
                                        className="prose prose-lg prose-slate font-sans text-gray-600 max-w-none [&>p]:mb-4"
                                        dangerouslySetInnerHTML={{ __html: pkg.description }}
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
                                                        <div
                                                            className="prose prose-slate font-sans text-gray-600 max-w-none [&>p]:mb-2"
                                                            dangerouslySetInnerHTML={{ __html: day.description }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Route Map Section */}
                            {pkg.stops && pkg.stops.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </span>
                                        Tour Route Map
                                    </h2>
                                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-[400px] z-0">
                                        <MapContainer
                                            center={[pkg.stops[0].lat, pkg.stops[0].lng]}
                                            zoom={7}
                                            scrollWheelZoom={false}
                                            className="h-full w-full"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {/* Markers */}
                                            {pkg.stops.map((stop, idx) => (
                                                <Marker key={idx} position={[stop.lat, stop.lng]}>
                                                    <Popup>
                                                        <div className="font-bold">{idx + 1}. {stop.name}</div>
                                                    </Popup>
                                                </Marker>
                                            ))}
                                            {/* Route Line */}
                                            <Polyline
                                                positions={pkg.stops.map(s => [s.lat, s.lng])}
                                                color="#2563eb" // Primary Blue
                                                weight={4}
                                                opacity={0.7}
                                                dashArray="10, 10"  // Dashed line
                                            />
                                            {/* Decorative Arrows */}
                                            <PolylineDecorator
                                                positions={pkg.stops.map(s => [s.lat, s.lng])}
                                            />
                                        </MapContainer>
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
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full btn-primary text-lg py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                                    >
                                        Inquire Now
                                    </button>
                                </div>

                                {/* Included Activities/Events */}
                                {(pkg.activities?.length > 0 || pkg.events?.length > 0) && (
                                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
                                        <div className="space-y-4">
                                            {pkg.activities?.map(act => (
                                                <div key={act._id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                                    <img src={act.images?.[0] || '/images/placeholder.jpg'} alt={act.title} className="w-16 h-16 object-cover rounded-md" />
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{act.title}</h4>
                                                        <a href={`/experiences/${act._id}`} className="text-xs text-primary-600 font-bold uppercase tracking-wider hover:underline">View Activity</a>
                                                    </div>
                                                </div>
                                            ))}
                                            {pkg.events?.map(ev => (
                                                <div key={ev._id} className="flex gap-3 items-start p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                                    <img src={ev.images?.[0] || '/images/placeholder.jpg'} alt={ev.title} className="w-16 h-16 object-cover rounded-md" />
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{ev.title}</h4>
                                                        <span className="text-xs text-yellow-700 block mb-1">{new Date(ev.startDate).toLocaleDateString()}</span>
                                                        <a href={`/events/${ev._id}`} className="text-xs text-primary-600 font-bold uppercase tracking-wider hover:underline">View Event</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Modal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    title={`Inquiry for ${pkg.title}`}
                                    maxWidth="max-w-4xl"
                                >
                                    <InquiryForm
                                        initialNote={`I'm interested in the "${pkg.title}" package.`}
                                        embedded={true}
                                    />
                                </Modal>

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
            </div >

            {/* FULL SCREEN GALLERY MODAL */}
            {
                isGalleryOpen && (
                    <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-6 right-6 text-white/50 hover:text-white z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-full h-full max-w-7xl mx-auto flex items-center">
                            <Swiper
                                modules={[Navigation, Pagination, Zoom]}
                                navigation
                                pagination={{ clickable: true, type: 'fraction' }}
                                zoom
                                spaceBetween={30}
                                slidesPerView={1}
                                className="w-full h-full md:h-[80vh] rounded-lg"
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx} className="flex items-center justify-center bg-black">
                                        <div className="swiper-zoom-container">
                                            <img
                                                src={img}
                                                alt={`Gallery ${idx + 1}`}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                                {videos.map((vid, idx) => (
                                    <SwiperSlide key={`vid-${idx}`} className="flex items-center justify-center bg-black">
                                        <video
                                            src={vid}
                                            controls
                                            className="max-h-full max-w-full"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                )
            }

            <Footer />
        </div >
    );
}

export default PackageDetails;
