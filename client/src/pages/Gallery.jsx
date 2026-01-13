import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get('/api/gallery');
            setImages(res.data);
        } catch (err) {
            console.error('Failed to fetch gallery images', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <ScrollToTop />
            <Header />

            {/* Hero Section */}
            <div className="relative h-[40vh] bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/images/hero_beach_drone.png')" }}></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 font-display">Our Gallery</h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto font-light">
                        Glimpses of unforgettable journeys and breathtaking landscapes from Sri Lanka.
                    </p>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                        {images.map((img) => (
                            <div key={img._id} className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-lg cursor-zoom-in bg-gray-100">
                                <img
                                    src={img.url}
                                    alt={img.title || 'Gallery Image'}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="text-center py-10 col-span-full text-gray-500">
                                No images available yet. check back soon!
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Gallery;
