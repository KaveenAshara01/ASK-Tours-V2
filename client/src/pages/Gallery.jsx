import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

function Gallery() {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsZoomed(false);
        }
    }, [selectedImage]);

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

    const handleImageClick = (img) => {
        setSelectedImage(img);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setIsZoomed(false);
    };

    const toggleZoom = (e) => {
        e.stopPropagation();
        setIsZoomed(!isZoomed);
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
                            <div
                                key={img._id}
                                className="break-inside-avoid relative group overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer"
                                onClick={() => handleImageClick(img)}
                            >
                                <img
                                    src={img.url}
                                    alt={img.title || 'Gallery Image'}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Technical Overlay */}

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

            {/* Lightbox / Zoom Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300"
                    onClick={closeModal}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white z-[70] p-2 transition-colors"
                        onClick={closeModal}
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className={`relative transition-transform duration-500 ease-out p-4 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                        onClick={toggleZoom}
                    >
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title || 'Full View'}
                            className={`max-w-full max-h-[90vh] object-contain shadow-2xl transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleZoom(e);
                            }}
                        />
                        {selectedImage.title && !isZoomed && (
                            <div className="absolute bottom-[-3rem] left-0 right-0 text-center text-white/80 font-medium tracking-wide">
                                {selectedImage.title}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gallery;
