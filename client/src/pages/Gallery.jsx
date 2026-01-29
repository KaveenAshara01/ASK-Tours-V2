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

            {/* Editorial Hero */}
            <div className="relative h-[75vh] bg-black flex flex-col justify-center items-center overflow-hidden pt-32 md:pt-20">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/images/hero_beach_drone.png')" }}></div>
                <div className="absolute inset-0 bg-black/40"></div>
                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div className="relative z-10 text-center px-4 pt-20">
                    <span className="block text-white font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm animate-fade-in border-b-2 border-white/50 w-fit mx-auto pb-2">
                        Visual Diary
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-4 uppercase tracking-tighter leading-[0.9] flex flex-col items-center">
                        <span className="block drop-shadow-lg text-white">Our</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 md:ml-32 pr-8 filter drop-shadow-lg leading-tight pb-4">
                            Gallery
                        </span>
                    </h1>
                </div>
            </div>

            {/* Masonry Grid - Technical & Sharp */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-12 bg-white">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {images.map((img) => (
                            <div key={img._id} className="break-inside-avoid relative group overflow-hidden bg-gray-100 border border-gray-100">
                                <img
                                    src={img.url}
                                    alt={img.title || 'Gallery Image'}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Technical Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="border border-white/50 p-6 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                        <span className="text-white font-bold uppercase tracking-[0.4em] text-xs block text-center mb-2">
                                            View
                                        </span>
                                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter text-center">
                                            Moment
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="text-center py-20 col-span-full text-gray-400 uppercase tracking-widest font-bold">
                                No images captured yet.
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
