import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import Modal from '../components/Modal';
import InquiryForm from '../components/InquiryForm';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import ContactSection from '../components/ContactSection';

function Packages() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="Our Packages"
                description="Explore our wide range of travel categories. Choose from beach holidays, cultural travels, wildlife safaris, and more."
                keywords="sri lanka tour categories, holiday packages, travel categories"
            />
            <Header />

            {/* Premium Hero Section */}
            <div className="relative min-h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900 pt-32 md:pt-20">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: "url('/images/safari_hero.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Bottom Fade to blend with content */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div className="relative z-20 text-center px-6 max-w-[1920px] mx-auto">
                    <span className="block text-white font-bold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm animate-fade-in notranslate">
                        Curated Collections
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 notranslate">
                        Discover<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-white pr-4 pb-2">
                            Journeys
                        </span>
                    </h1>
                    <div className="w-24 h-1 bg-secondary-500 mx-auto rounded-full"></div>
                </div>
            </div>

            {/* Categories Grid - Editorial Wall */}
            <section className="relative py-20 px-4 md:px-8 bg-white">
                <div className="max-w-[1920px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">
                            Select Your Path
                        </h2>
                        <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                            Browse our exclusively curated travel collections designed for unique experiences.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-xl font-light">No collections available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {categories.map((cat, index) => (
                                <div
                                    key={cat._id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CategoryCard category={cat} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Custom Inquiry CTA */}
                    <div className="mt-24 bg-gray-50 rounded-3xl p-12 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-6">
                                Need a Tailor-Made Experience?
                            </h3>
                            <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
                                We specialize in crafting unique journeys. If you don't see exactly what you're looking for, let us design a custom package just for you.
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-block bg-primary-600 text-white font-black uppercase tracking-[0.2em] py-5 px-12 hover:bg-secondary-500 hover:text-primary-950 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-none"
                            >
                                Start Planning
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <ContactSection />
            <Footer />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Customize Your Journey"
                maxWidth="max-w-4xl"
            >
                <InquiryForm
                    initialNote="I would like to request a custom package tailored to my interests."
                    embedded={true}
                />
            </Modal>
        </div>
    );
}

export default Packages;
