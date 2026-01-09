import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PackageCard from '../components/PackageCard';
import ContactSection from '../components/ContactSection';

function Packages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPackages();
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('/api/packages');
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[400px] bg-gray-900 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-60"
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Our Exclusive Packages</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Choose your perfect adventure from our carefully curated collection
                    </p>
                </div>
            </div>

            {/* Packages Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-xl">No packages available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {packages.map((pkg, index) => (
                                <div
                                    key={pkg._id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                >
                                    <PackageCard package={pkg} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
}

export default Packages;
