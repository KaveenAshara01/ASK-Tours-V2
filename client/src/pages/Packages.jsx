import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';


import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import ContactSection from '../components/ContactSection';

function Packages() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="bg-gray-50 min-h-screen">
            <SEO
                title="Our Packages"
                description="Explore our wide range of travel categories. Choose from beach holidays, cultural travels, wildlife safaris, and more."
                keywords="sri lanka tour categories, holiday packages, travel categories"
            />
            <Header />

            {/* Wave Clip Path Definition */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                        <path d="M0,0.02 C0.25,0.15 0.25,0 0.5,0 S0.75,0.15 1,0.02 L1,1 L0,1 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Hero Section */}
            <div className="relative h-[400px] bg-gray-900 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-60"
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Journey</span></h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Explore our curated travel collections and find your perfect Sri Lankan adventure.
                    </p>
                </div>
            </div>

            {/* Categories Grid with Wave */}
            <div className="relative -mt-24 z-20 filter drop-shadow-xl">
                <section className="relative pt-32 pb-20 px-4 rounded-t-[3rem] md:rounded-none clip-wave-md min-h-[60vh] overflow-hidden">
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                        style={{ backgroundImage: "url('/images/hero_beach_drone.png')" }}
                    />
                    <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-[2px]"></div>

                    <div className="relative z-10 max-w-7xl mx-auto">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-600 text-xl">No categories available at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </div>
                </section>
            </div>

            <ContactSection />
            <Footer />
        </div>
    );
}

export default Packages;
