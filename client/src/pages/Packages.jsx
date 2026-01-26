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

            {/* Editorial Hero Section */}
            <div className="relative h-[75vh] bg-gray-900 flex flex-col justify-center items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-50"
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 text-center px-4 w-full max-w-[1920px] mx-auto pt-20">
                    <span className="block text-white font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm animate-fade-in border-b-2 border-white/50 w-fit mx-auto pb-2">
                        Curated Collections
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-2 uppercase tracking-tighter leading-[0.9] flex flex-col items-center">
                        <span className="block drop-shadow-lg">Discover</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-white md:ml-24 pr-4">
                            Journeys
                        </span>
                    </h1>
                </div>
            </div>

            {/* Categories Grid - Stark & Clean */}
            <section className="relative py-12 px-4 bg-white">
                <div className="max-w-[1920px] mx-auto z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-4 border-b border-gray-100 pb-8">
                        <div>
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">
                                Select Your Path
                            </h2>
                            <p className="text-gray-500 font-medium mt-2 max-w-xl">
                                Browse our travel categories below to find detailed itineraries and packages tailored to your journey.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-xl">No categories available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat, index) => (
                                <div
                                    key={cat._id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                >
                                    <CategoryCard category={cat} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Custom Inquiry CTA */}
                    <div className="mt-24 text-center border-t border-gray-100 pt-16">
                        <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4">
                            Need a Tailor-Made Experience?
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                            We specialize in crafting unique journeys. If you don't see exactly what you're looking for, let us design a custom package just for you.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block bg-primary-600 text-white font-black uppercase tracking-[0.2em] py-4 px-12 hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Inquire Now
                        </button>
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
